import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ViewUserDTO } from './dto';
import { AuthGuard } from 'src/auth/guards';
import { ApiBearerAuth } from '@nestjs/swagger';
import { SWAGGER_BEARER_NAME } from 'src/common';
import * as types from 'src/auth/types';
import { User } from 'src/decorators';

@UseGuards(AuthGuard)
@ApiBearerAuth(SWAGGER_BEARER_NAME)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getUser(@User() user: types.JwtPayload): Promise<ViewUserDTO> {
    return this.usersService.getUser(user.sub);
  }
}
