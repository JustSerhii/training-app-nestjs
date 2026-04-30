import { Body, Controller, Post } from '@nestjs/common';
import { AccessDTO, LoginUserDTO, RegisterUserDTO } from './dto';
import { ViewUserDTO } from 'src/users/dto';
import { AuthService } from './auth.service';

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
}
