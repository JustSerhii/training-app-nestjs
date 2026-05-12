import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { WorkoutExercisesService } from './workout-exercises.service';
import * as types from 'src/auth/types';
import {
  CreateWorkoutExerciseDTO,
  ReorderWorkoutExercisesDTO,
  UpdateWorkoutExerciseDTO,
  ViewWorkoutExerciseDTO,
} from './dto';
import { AuthGuard } from 'src/auth/guards';
import { ApiBearerAuth } from '@nestjs/swagger';
import { SWAGGER_BEARER_NAME } from 'src/common';
import {
  CursorPageOptionsDto,
  CursorPaginatedResponseDto,
} from 'src/common/dto/cursor-pagination';
import { User } from 'src/decorators';

@UseGuards(AuthGuard)
@ApiBearerAuth(SWAGGER_BEARER_NAME)
@Controller('workouts/:workoutId/workout-exercises')
export class WorkoutExercisesController {
  constructor(
    private readonly workoutExercisesService: WorkoutExercisesService,
  ) {}

  @Post()
  createWorkoutExercise(
    @Param('workoutId') workoutId: string,
    @Body() data: CreateWorkoutExerciseDTO,
    @User() user: types.JwtPayload,
  ): Promise<ViewWorkoutExerciseDTO> {
    return this.workoutExercisesService.createWorkoutExercise(
      user.sub,
      workoutId,
      data,
    );
  }

  @Patch('reorder')
  reorderWorkoutExercises(
    @Param('workoutId') workoutId: string,
    @User() user: types.JwtPayload,
    @Body() data: ReorderWorkoutExercisesDTO,
  ): Promise<ViewWorkoutExerciseDTO[]> {
    return this.workoutExercisesService.reorderWorkoutExercises(
      user.sub,
      workoutId,
      data,
    );
  }

  @Get(':workoutExerciseId')
  getWorkoutExercise(
    @Param('workoutId') workoutId: string,
    @Param('workoutExerciseId')
    workoutExerciseId: string,
    @User() user: types.JwtPayload,
  ): Promise<ViewWorkoutExerciseDTO> {
    return this.workoutExercisesService.getWorkoutExercise(
      user.sub,
      workoutId,
      workoutExerciseId,
    );
  }

  @Get()
  getWorkoutExercises(
    @Param('workoutId') workoutId: string,
    @User() user: types.JwtPayload,
    @Query() query: CursorPageOptionsDto,
  ): Promise<CursorPaginatedResponseDto<ViewWorkoutExerciseDTO>> {
    return this.workoutExercisesService.getWorkoutExercises(
      user.sub,
      workoutId,
      query,
    );
  }

  @Patch(':workoutExerciseId')
  updateWorkoutExercise(
    @Param('workoutId') workoutId: string,
    @Param('workoutExerciseId')
    workoutExerciseId: string,
    @Body() data: UpdateWorkoutExerciseDTO,
    @User() user: types.JwtPayload,
  ): Promise<ViewWorkoutExerciseDTO> {
    return this.workoutExercisesService.updateWorkoutExercise(
      user.sub,
      workoutId,
      workoutExerciseId,
      data,
    );
  }

  @HttpCode(204)
  @Delete(':workoutExerciseId')
  deletWorkoutExercise(
    @User() user: types.JwtPayload,
    @Param('workoutExerciseId') workoutExerciseId: string,
    @Param('workoutId') workoutId: string,
  ): Promise<void> {
    return this.workoutExercisesService.deleteWorkoutExercise(
      user.sub,
      workoutId,
      workoutExerciseId,
    );
  }
}
