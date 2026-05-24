import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ExerciseSessionsService } from './exercise-sessions.service';
import { AuthGuard } from 'src/auth/guards';
import { User } from 'src/decorators';
import * as types from 'src/auth/types';

@UseGuards(AuthGuard)
@Controller('exercise-sessions')
export class ExerciseSessionsController {
  constructor(private readonly service: ExerciseSessionsService) {}

  @Get('exercise/:exerciseId/history')
  getVolumeHistory(
    @User() user: types.JwtPayload,
    @Param('exerciseId') exerciseId: string,
    @Query('limit') limit?: string,
  ) {
    return this.service.getExerciseVolumeHistory(
      user.sub,
      exerciseId,
      limit ? parseInt(limit, 10) : 20,
    );
  }
}
