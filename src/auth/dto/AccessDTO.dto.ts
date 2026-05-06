import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { ViewUserDTO } from 'src/users/dto';

export class AccessDTO extends ViewUserDTO {
  @ApiProperty({ description: 'Access token' })
  @IsString()
  accessToken!: string;

  @ApiProperty({ description: 'Refersh token' })
  @IsString()
  refreshToken!: string;
}
