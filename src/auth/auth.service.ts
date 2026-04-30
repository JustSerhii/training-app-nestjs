import { ViewUserDTO } from 'src/users/dto';
import { AccessDTO, LoginUserDTO, RegisterUserDTO } from './dto';
import { PrismaService } from 'src/prisma';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Hasher } from 'src/common/models';
import { JwtService } from '@nestjs/jwt';

const ERROR_MESSAGE = 'Wrong email or password';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(data: RegisterUserDTO): Promise<ViewUserDTO> {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        email: {
          equals: data.email,
          mode: 'insensitive',
        },
      },
    });

    if (existingUser) throw new UnauthorizedException(ERROR_MESSAGE);

    const hash = await Hasher.hash(data.password);

    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        hash,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    return user;
  }

  async login(data: LoginUserDTO): Promise<AccessDTO> {
    const user = await this.prisma.user.findFirst({
      where: {
        email: { equals: data.email, mode: 'insensitive' },
      },
    });
    if (!user) throw new UnauthorizedException(ERROR_MESSAGE);

    const matched = await Hasher.verify(user.hash, data.password);

    if (!matched) throw new UnauthorizedException(ERROR_MESSAGE);

    const payload = { sub: user.id, name: user.name };

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      token: await this.jwtService.signAsync(payload),
    };
  }
}
