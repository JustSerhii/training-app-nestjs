import { AccessDTO, LoginUserDTO, RegisterUserDTO } from './dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Hasher } from 'src/common/models';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from 'src/users/users.repository';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';

const WRONG_EMAIL_PASSWORD_ERROR = 'Wrong email or password';
const INVALID_REFRESH_TOKEN_ERROR = 'Invalid refresh token';

const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const REFRESH_TOKEN_TTL_SECONDS = '7d';

@Injectable()
export class AuthService {
  private readonly COOKIE_DOMAIN?: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly usersRepository: UsersRepository,
    private readonly configService: ConfigService,
  ) {
    this.COOKIE_DOMAIN = configService.get<string>('COOKIE_DOMAIN');
  }

  async register(res: Response, data: RegisterUserDTO): Promise<AccessDTO> {
    const existingUser = await this.usersRepository.getByEmail(data.email);

    if (existingUser)
      throw new UnauthorizedException(WRONG_EMAIL_PASSWORD_ERROR);

    const hash = await Hasher.hash(data.password);

    const user = await this.usersRepository.register(data, hash);

    const { accessToken } = await this.auth(res, user.id);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      accessToken,
    };
  }

  async login(res: Response, data: LoginUserDTO): Promise<AccessDTO> {
    const user = await this.usersRepository.getByEmail(data.email);
    if (!user) throw new UnauthorizedException(WRONG_EMAIL_PASSWORD_ERROR);

    const matched = await Hasher.verify(user.hash, data.password);
    if (!matched) throw new UnauthorizedException(WRONG_EMAIL_PASSWORD_ERROR);

    const { accessToken } = await this.auth(res, user.id);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      accessToken,
    };
  }

  async refreshTokens(
    req: Request,
    res: Response,
  ): Promise<{ accessToken: string }> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const refreshToken = req.cookies['refreshToken'];

    if (!refreshToken || typeof refreshToken !== 'string') {
      throw new UnauthorizedException(INVALID_REFRESH_TOKEN_ERROR);
    }

    let payload: { sub: string };

    try {
      payload = await this.jwtService.verifyAsync<{ sub: string }>(
        refreshToken,
        {
          secret: process.env.JWT_REFRESH_SECRET,
        },
      );
    } catch {
      throw new UnauthorizedException(INVALID_REFRESH_TOKEN_ERROR);
    }

    const user = await this.usersRepository.getByIdWithToken(payload.sub);
    if (!user?.refreshToken)
      throw new UnauthorizedException(INVALID_REFRESH_TOKEN_ERROR);

    const matched = await Hasher.verify(user.refreshToken, refreshToken);
    if (!matched) throw new UnauthorizedException(INVALID_REFRESH_TOKEN_ERROR);

    return this.auth(res, user.id);
  }

  private async generateTokens(
    userId: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { sub: userId };

    const accessToken = await this.jwtService.signAsync(payload);

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: REFRESH_TOKEN_TTL_SECONDS,
    });

    return { accessToken, refreshToken };
  }

  private setCookie(res: Response, value: string, expires: Date): void {
    const isProduction =
      this.configService.get('APP_ENVIRONMENT') === 'production';

    res.cookie('refreshToken', value, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      domain: isProduction ? undefined : this.COOKIE_DOMAIN,
      expires,
      path: '/',
    });
  }

  private async auth(
    res: Response,
    id: string,
  ): Promise<{ accessToken: string }> {
    const { accessToken, refreshToken } = await this.generateTokens(id);
    this.setCookie(
      res,
      refreshToken,
      new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
    );

    const hashedRefreshToken = await Hasher.hash(refreshToken);
    await this.usersRepository.updateRefreshToken(id, hashedRefreshToken);

    return { accessToken };
  }

  async logout(userId: string, res: Response): Promise<void> {
    await this.usersRepository.clearRefreshToken(userId);
    this.setCookie(res, 'refreshToken', new Date(0));
  }
}
