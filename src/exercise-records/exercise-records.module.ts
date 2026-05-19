import { Module } from '@nestjs/common';
import { ExerciseRecordRepository } from './exercise-records.repository';
import { ExerciseRecordsService } from './exercise-records.service';
import { ExerciseRecordsController } from './exercise-records.controller';

@Module({
  providers: [ExerciseRecordRepository, ExerciseRecordsService],
  controllers: [ExerciseRecordsController],
  imports: [],
  exports: [ExerciseRecordRepository, ExerciseRecordsService],
})
export class ExerciseRecordModule {}
