import { Module } from '@nestjs/common';
import { WorkoutExercisesController } from './workout-exercises.controller';
import { WorkoutExercisesService } from './workout-exercises.service';
import { WorkoutsExercisesRepository } from './workout-exercises.repository';
import { WorkoutsModule } from 'src/workouts/workouts.module';

@Module({
  controllers: [WorkoutExercisesController],
  providers: [WorkoutExercisesService, WorkoutsExercisesRepository],
  imports: [WorkoutsModule],
  exports: [WorkoutsExercisesRepository],
})
export class WorkoutExercisesModule {}
