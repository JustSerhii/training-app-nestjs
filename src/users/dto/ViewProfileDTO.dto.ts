import { ViewUserDTO } from './ViewUserDTO.dto';

export class ViewProfileDto extends ViewUserDTO {
  bodyWeight!: number | null;
}
