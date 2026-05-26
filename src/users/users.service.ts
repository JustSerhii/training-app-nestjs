import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto, ViewProfileDto } from './dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getUser(id: string): Promise<ViewProfileDto> {
    const user = await this.usersRepository.getById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateUser(id: string, data: UpdateUserDto): Promise<ViewProfileDto> {
    return this.usersRepository.updateUser(id, data);
  }
}
