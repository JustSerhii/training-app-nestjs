import { Module } from '@nestjs/common';
import { WorkoutExercisesController } from './workout-exercises.controller';
import { WorkoutExercisesService } from './workout-exercises.service';
import { WorkoutsExercisesRepository } from './workout-exercises.repository';
import { WorkoutsModule } from 'src/workouts/workouts.module';
import { ExerciseRecordModule } from 'src/exercise-records/exercise-records.module';
import { SetsRepositoryModule } from 'src/sets/sets-repository.module';
import { ExerciseSessionsModule } from 'src/exercise-sessions/exercise-sessions.module';

@Module({
  controllers: [WorkoutExercisesController],
  providers: [WorkoutExercisesService, WorkoutsExercisesRepository],
  imports: [
    WorkoutsModule,
    ExerciseRecordModule,
    SetsRepositoryModule,
    ExerciseSessionsModule,
  ],
  exports: [WorkoutsExercisesRepository],
})
export class WorkoutExercisesModule {}
