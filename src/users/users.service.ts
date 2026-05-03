import { Injectable, NotFoundException } from '@nestjs/common';
import { ViewUserDTO } from './dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getUser(id: string): Promise<ViewUserDTO> {
    const user = await this.usersRepository.getById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
