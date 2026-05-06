import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  AccessDTO,
  LoginUserDTO,
  RefreshResponseDTO,
  RefreshTokenDTO,
  RegisterUserDTO,
} from './dto';
import { ViewUserDTO } from 'src/users/dto';
import { AuthService } from './auth.service';
import * as types from './types';
import { AuthGuard } from './guards';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() data: RegisterUserDTO): Promise<ViewUserDTO> {
    return this.authService.register(data);
  }

  @Post('login')
  login(@Body() data: LoginUserDTO): Promise<AccessDTO> {
    return this.authService.login(data);
  }

  @Post('refresh')
  refresh(
    @Body() { refreshToken }: RefreshTokenDTO,
  ): Promise<RefreshResponseDTO> {
    return this.authService.refreshTokens(refreshToken);
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  logout(@Req() req: types.AuthRequest): Promise<void> {
    return this.authService.clearRefreshToken(req.user.sub);
  }
}
