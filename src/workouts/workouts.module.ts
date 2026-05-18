import { Module } from '@nestjs/common';
import { WorkoutsController } from './workouts.controller';
import { WorkoutsService } from './workouts.service';
import { WorkoutsRepository } from './workouts.repository';
import { ExerciseRecordModule } from 'src/exercise-records/exercise-records.module';
import { SetsRepositoryModule } from 'src/sets/sets-repository.module';

@Module({
  controllers: [WorkoutsController],
  providers: [WorkoutsService, WorkoutsRepository],
  imports: [ExerciseRecordModule, SetsRepositoryModule],
  exports: [WorkoutsRepository],
})
export class WorkoutsModule {}
