import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards';
import { User } from 'src/decorators';
import * as types from 'src/auth/types';
import { ExerciseRecordDTO } from './dto';
import { ExerciseRecordsService } from './exercise-records.service';

@UseGuards(AuthGuard)
@Controller('exercise-records')
export class ExerciseRecordsController {
  constructor(
    private readonly exerciseRecordsService: ExerciseRecordsService,
  ) {}

  @Get()
  getAllRecords(
    @User() user: types.JwtPayload,
  ): Promise<ExerciseRecordDTO[] | []> {
    return this.exerciseRecordsService.getAllRecordsByUser(user.sub);
  }
}
