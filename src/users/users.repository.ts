import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { USER_SELECT } from './user.select';
import { RegisterUserDTO } from 'src/auth/dto';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getById(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: USER_SELECT,
    });
  }

  async getByIdWithToken(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        ...USER_SELECT,
        refreshToken: true,
      },
    });
  }

  async getByEmail(email: string) {
    return this.prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: 'insensitive',
        },
      },
    });
  }

  async register(data: RegisterUserDTO, hash: string) {
    return this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        hash,
      },
      select: USER_SELECT,
    });
  }

  async updateRefreshToken(
    userId: string,
    hashedRefreshToken: string,
  ): Promise<void> {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshToken: hashedRefreshToken,
      },
    });
  }

  async clearRefreshToken(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshToken: null,
      },
    });
  }
}
