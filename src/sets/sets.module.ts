import { Module } from '@nestjs/common';
import { SetsController } from './sets.controller';
import { SetsService } from './sets.service';
import { WorkoutExercisesModule } from 'src/workout-exercises/workout-exercises.module';
import { ExerciseRecordModule } from 'src/exercise-records/exercise-records.module';
import { SetsRepositoryModule } from './sets-repository.module';

@Module({
  controllers: [SetsController],
  providers: [SetsService],
  imports: [SetsRepositoryModule, WorkoutExercisesModule, ExerciseRecordModule],
})
export class SetsModule {}
