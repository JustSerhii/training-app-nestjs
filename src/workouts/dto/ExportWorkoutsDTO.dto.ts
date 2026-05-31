import { IsArray, IsUUID, ArrayMinSize, ArrayMaxSize } from 'class-validator';

export class ExportWorkoutsDTO {
  @IsArray()
  @IsUUID('4', {
    each: true,
    message: 'Each workoutId must be a valid UUID v4',
  })
  @ArrayMinSize(1, { message: 'At least one workoutId is required' })
  @ArrayMaxSize(50, { message: 'Cannot export more than 50 workouts at once' })
  workoutIds!: string[];
}
