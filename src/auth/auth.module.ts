import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';

const jwtSecret = process.env.JWT_ACCESS_SECRET;
if (!jwtSecret) {
  throw new Error('JWT_SECRET is not defined');
}

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: jwtSecret,
      signOptions: {
        expiresIn: '2h',
      },
      verifyOptions: {
        algorithms: ['HS256'],
        ignoreExpiration: false,
      },
    }),
  ],
  exports: [],
})
export class AuthModule {}
