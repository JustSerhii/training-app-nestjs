import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { ViewUserDTO } from './dto';
import { USER_SELECT } from './user.select';
import { RegisterUserDTO } from 'src/auth/dto';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getById(userId: string): Promise<ViewUserDTO | null> {
    return this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: USER_SELECT,
    });
  }

  getByEmail(email: string) {
    return this.prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: 'insensitive',
        },
      },
    });
  }

  register(data: RegisterUserDTO, hash: string): Promise<ViewUserDTO> {
    return this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        hash,
      },
      select: USER_SELECT,
    });
  }
}
