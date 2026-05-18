import { Module } from '@nestjs/common';
import { ExerciseRecordRepository } from './exercise-records.repository';
import { ExerciseRecordsService } from './exercise-records.service';

@Module({
  providers: [ExerciseRecordRepository, ExerciseRecordsService],
  controllers: [],
  imports: [],
  exports: [ExerciseRecordRepository, ExerciseRecordsService],
})
export class ExerciseRecordModule {}
