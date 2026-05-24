import { Module } from '@nestjs/common';
import { ExerciseSessionsService } from './exercise-sessions.service';
import { ExerciseSessionsController } from './exercise-sessions.controller';

@Module({
  controllers: [ExerciseSessionsController],
  providers: [ExerciseSessionsService],
  imports: [],
  exports: [ExerciseSessionsService],
})
export class ExerciseSessionsModule {}
