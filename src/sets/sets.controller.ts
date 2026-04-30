import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SetsService } from './sets.service';
import { CreateSetDTO, ReorderSetsDTO, UpdateSetDTO, ViewSetDTO } from './dto';
import * as types from 'src/auth/types';
import { AuthGuard } from 'src/auth/guards';

@UseGuards(AuthGuard)
@Controller('workouts/:workoutId/workout-exercises/:workoutExerciseId/sets')
export class SetsController {
  constructor(private readonly setsService: SetsService) {}

  @Post()
  createSet(
    @Req() req: types.AuthRequest,
    @Body() data: CreateSetDTO,
    @Param('workoutExerciseId') workoutExerciseId: string,
  ): Promise<ViewSetDTO> {
    return this.setsService.createSet(req.user.sub, workoutExerciseId, data);
  }

  @Get(':setId')
  getSet(
    @Req() req: types.AuthRequest,
    @Param('workoutExerciseId') workoutExerciseId: string,
    @Param('setId') setId: string,
  ): Promise<ViewSetDTO> {
    return this.setsService.getSet(req.user.sub, workoutExerciseId, setId);
  }

  @Get()
  getSets(
    @Req() req: types.AuthRequest,
    @Param('workoutExerciseId') workoutExerciseId: string,
  ): Promise<ViewSetDTO[]> {
    return this.setsService.getSets(req.user.sub, workoutExerciseId);
  }

  @Patch('reorder')
  reorderSets(
    @Req() req: types.AuthRequest,
    @Param('workoutExerciseId') workoutExerciseId: string,
    @Body() data: ReorderSetsDTO,
  ): Promise<ViewSetDTO[]> {
    return this.setsService.reorderSets(req.user.sub, workoutExerciseId, data);
  }

  @Patch(':setId')
  updateSet(
    @Req() req: types.AuthRequest,
    @Param('workoutExerciseId') workoutExerciseId: string,
    @Param('setId') setId: string,
    @Body() data: UpdateSetDTO,
  ): Promise<ViewSetDTO> {
    return this.setsService.updateSet(
      req.user.sub,
      workoutExerciseId,
      setId,
      data,
    );
  }

  @HttpCode(204)
  @Delete(':setId')
  deleteSet(
    @Req() req: types.AuthRequest,
    @Param('workoutExerciseId') workoutExerciseId: string,
    @Param('setId') setId: string,
  ): Promise<void> {
    return this.setsService.deleteSet(req.user.sub, workoutExerciseId, setId);
  }
}
