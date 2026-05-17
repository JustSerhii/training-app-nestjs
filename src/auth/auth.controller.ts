import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import {
  AccessDTO,
  LoginUserDTO,
  RefreshResponseDTO,
  RegisterUserDTO,
} from './dto';
import { ViewUserDTO } from 'src/users/dto';
import { AuthService } from './auth.service';
import * as types from './types';
import { AuthGuard } from './guards';
import { User } from 'src/decorators';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(
    @Res({ passthrough: true }) res: Response,
    @Body() data: RegisterUserDTO,
  ): Promise<ViewUserDTO> {
    return this.authService.register(res, data);
  }

  @Post('login')
  login(
    @Res({ passthrough: true }) res: Response,
    @Body() data: LoginUserDTO,
  ): Promise<AccessDTO> {
    return this.authService.login(res, data);
  }

  @Post('refresh')
  refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<RefreshResponseDTO> {
    return this.authService.refreshTokens(req, res);
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  logout(
    @User() user: types.JwtPayload,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    return this.authService.logout(user.sub, res);
  }
}
