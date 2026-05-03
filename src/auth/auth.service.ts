import { ViewUserDTO } from 'src/users/dto';
import { AccessDTO, LoginUserDTO, RegisterUserDTO } from './dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Hasher } from 'src/common/models';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from 'src/users/users.repository';

const ERROR_MESSAGE = 'Wrong email or password';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersRepository: UsersRepository,
  ) {}

  async register(data: RegisterUserDTO): Promise<ViewUserDTO> {
    const existingUser = await this.usersRepository.getByEmail(data.email);

    if (existingUser) throw new UnauthorizedException(ERROR_MESSAGE);

    const hash = await Hasher.hash(data.password);

    return this.usersRepository.register(data, hash);
  }

  async login(data: LoginUserDTO): Promise<AccessDTO> {
    const user = await this.usersRepository.getByEmail(data.email);
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
