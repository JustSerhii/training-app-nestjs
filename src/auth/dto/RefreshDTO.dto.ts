import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDTO {
  @ApiProperty({ description: 'Refresh token issued at login' })
  @IsString()
  refreshToken!: string;
}

export class RefreshResponseDTO {
  @ApiProperty({ description: 'New access token' })
  @IsString()
  accessToken!: string;

  @ApiProperty({ description: 'New refresh token' })
  @IsString()
  refreshToken!: string;
}
