import { IsString } from 'class-validator';
import { ViewUserDTO } from 'src/users/dto';

export class AccessDTO extends ViewUserDTO {
  @IsString()
  token!: string;
}
