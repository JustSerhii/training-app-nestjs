import { Module } from '@nestjs/common';
import { WorkoutExercisesController } from './workout-exercises.controller';
import { WorkoutExercisesService } from './workout-exercises.service';

@Module({
  controllers: [WorkoutExercisesController],
  providers: [WorkoutExercisesService],
  imports: [],
  exports: [],
})
export class WorkoutExercisesModule {}
