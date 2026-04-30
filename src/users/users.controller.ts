import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ViewUserDTO } from './dto';
import { AuthGuard } from 'src/auth/guards';
import * as authRequestInterface from 'src/auth/types/auth-request.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get('me')
  getUser(@Req() req: authRequestInterface.AuthRequest): Promise<ViewUserDTO> {
    return this.usersService.getUser(req.user.sub);
  }
}
