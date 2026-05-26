import { Module } from '@nestjs/common';
import { WorkoutsController } from './workouts.controller';
import { WorkoutsService } from './workouts.service';
import { WorkoutsRepository } from './workouts.repository';
import { ExerciseRecordModule } from 'src/exercise-records/exercise-records.module';
import { SetsRepositoryModule } from 'src/sets/sets-repository.module';
import { ExerciseSessionsModule } from 'src/exercise-sessions/exercise-sessions.module';
import { WorkoutsPdfService } from './workouts-pdf.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [WorkoutsController],
  providers: [WorkoutsService, WorkoutsRepository, WorkoutsPdfService],
  imports: [
    ExerciseRecordModule,
    SetsRepositoryModule,
    ExerciseSessionsModule,
    UsersModule,
  ],
  exports: [WorkoutsRepository],
})
export class WorkoutsModule {}
