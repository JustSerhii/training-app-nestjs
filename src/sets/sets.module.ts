import { Module } from '@nestjs/common';
import { SetsController } from './sets.controller';
import { SetsService } from './sets.service';
import { WorkoutExercisesModule } from 'src/workout-exercises/workout-exercises.module';
import { SetsRepository } from './sets.repository';

@Module({
  controllers: [SetsController],
  providers: [SetsService, SetsRepository],
  imports: [WorkoutExercisesModule],
  exports: [],
})
export class SetsModule {}
