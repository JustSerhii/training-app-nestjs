import { Module } from '@nestjs/common';
import { ExerciseSessionsService } from './exercise-sessions.service';

@Module({
  providers: [ExerciseSessionsService],
  imports: [],
  exports: [ExerciseSessionsService],
})
export class ExerciseSessionsModule {}
