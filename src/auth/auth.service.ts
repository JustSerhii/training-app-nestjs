import { ViewUserDTO } from 'src/users/dto';
import { AccessDTO, LoginUserDTO, RegisterUserDTO } from './dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Hasher } from 'src/common/models';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from 'src/users/users.repository';

const WRONG_EMAIL_PASSWORD_ERROR = 'Wrong email or password';
const INVALID_REFRESH_TOKEN_ERROR = 'Invalid refresh token';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersRepository: UsersRepository,
  ) {}

  async register(data: RegisterUserDTO): Promise<ViewUserDTO> {
    const existingUser = await this.usersRepository.getByEmail(data.email);

    if (existingUser)
      throw new UnauthorizedException(WRONG_EMAIL_PASSWORD_ERROR);

    const hash = await Hasher.hash(data.password);

    return this.usersRepository.register(data, hash);
  }

  async login(data: LoginUserDTO): Promise<AccessDTO> {
    const user = await this.usersRepository.getByEmail(data.email);
    if (!user) throw new UnauthorizedException(WRONG_EMAIL_PASSWORD_ERROR);

    const matched = await Hasher.verify(user.hash, data.password);
    if (!matched) throw new UnauthorizedException(WRONG_EMAIL_PASSWORD_ERROR);

    const { accessToken, refreshToken } = await this.generateTokens(
      user.id,
      user.name,
    );

    const hashedRefreshToken = await Hasher.hash(refreshToken);
    await this.usersRepository.updateRefreshToken(user.id, hashedRefreshToken);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    let payload: { sub: string; name: string };

    try {
      payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    } catch {
      throw new UnauthorizedException(INVALID_REFRESH_TOKEN_ERROR);
    }

    const user = await this.usersRepository.getById(payload.sub);
    if (!user?.refreshToken)
      throw new UnauthorizedException(INVALID_REFRESH_TOKEN_ERROR);

    const matched = await Hasher.verify(user.refreshToken, refreshToken);
    if (!matched) throw new UnauthorizedException(INVALID_REFRESH_TOKEN_ERROR);

    const { accessToken, refreshToken: newRefreshToken } =
      await this.generateTokens(user.id, user.name);

    const hashedRefreshToken = await Hasher.hash(newRefreshToken);
    await this.usersRepository.updateRefreshToken(user.id, hashedRefreshToken);

    return { accessToken, refreshToken: newRefreshToken };
  }

  private async generateTokens(userId: string, name: string) {
    const payload = { sub: userId, name };

    const accessToken = await this.jwtService.signAsync(payload);

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '30d',
    });

    return { accessToken, refreshToken };
  }

  async clearRefreshToken(userId: string): Promise<void> {
    await this.usersRepository.clearRefreshToken(userId);
  }
}
