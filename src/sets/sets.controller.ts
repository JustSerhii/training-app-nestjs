import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SetsService } from './sets.service';
import { CreateSetDTO, ReorderSetsDTO, UpdateSetDTO, ViewSetDTO } from './dto';
import * as types from 'src/auth/types';
import { AuthGuard } from 'src/auth/guards';
import { ApiBearerAuth } from '@nestjs/swagger';
import { SWAGGER_BEARER_NAME } from 'src/common';
import { User } from 'src/decorators';

@UseGuards(AuthGuard)
@ApiBearerAuth(SWAGGER_BEARER_NAME)
@Controller('workouts/:workoutId/workout-exercises/:workoutExerciseId/sets')
export class SetsController {
  constructor(private readonly setsService: SetsService) {}

  @Post()
  createSet(
    @User() user: types.JwtPayload,
    @Body() data: CreateSetDTO,
    @Param('workoutExerciseId') workoutExerciseId: string,
  ): Promise<ViewSetDTO> {
    return this.setsService.createSet(user.sub, workoutExerciseId, data);
  }

  @Get(':setId')
  getSet(
    @User() user: types.JwtPayload,
    @Param('workoutExerciseId') workoutExerciseId: string,
    @Param('setId') setId: string,
  ): Promise<ViewSetDTO> {
    return this.setsService.getSet(user.sub, workoutExerciseId, setId);
  }

  @Get()
  getSets(
    @User() user: types.JwtPayload,
    @Param('workoutExerciseId') workoutExerciseId: string,
  ): Promise<ViewSetDTO[]> {
    return this.setsService.getSets(user.sub, workoutExerciseId);
  }

  @Patch('reorder')
  reorderSets(
    @User() user: types.JwtPayload,
    @Param('workoutExerciseId') workoutExerciseId: string,
    @Body() data: ReorderSetsDTO,
  ): Promise<ViewSetDTO[]> {
    return this.setsService.reorderSets(user.sub, workoutExerciseId, data);
  }

  @Patch(':setId')
  updateSet(
    @User() user: types.JwtPayload,
    @Param('workoutExerciseId') workoutExerciseId: string,
    @Param('setId') setId: string,
    @Body() data: UpdateSetDTO,
  ): Promise<ViewSetDTO> {
    return this.setsService.updateSet(user.sub, workoutExerciseId, setId, data);
  }

  @HttpCode(204)
  @Delete(':setId')
  deleteSet(
    @User() user: types.JwtPayload,
    @Param('workoutExerciseId') workoutExerciseId: string,
    @Param('setId') setId: string,
  ): Promise<void> {
    return this.setsService.deleteSet(user.sub, workoutExerciseId, setId);
  }
}
