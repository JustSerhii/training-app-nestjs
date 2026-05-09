import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshResponseDTO {
  @ApiProperty({ description: 'New access token' })
  @IsString()
  accessToken!: string;
}
