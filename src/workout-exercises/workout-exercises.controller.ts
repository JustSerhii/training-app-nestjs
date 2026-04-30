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
import { WorkoutExercisesService } from './workout-exercises.service';
import * as types from 'src/auth/types';
import {
  CreateWorkoutExerciseDTO,
  UpdateWorkoutExerciseDTO,
  ViewWorkoutExerciseDTO,
} from './dto';
import { AuthGuard } from 'src/auth/guards';

@UseGuards(AuthGuard)
@Controller('workouts/:workoutId/workout-exercises')
export class WorkoutExercisesController {
  constructor(
    private readonly workoutExercisesService: WorkoutExercisesService,
  ) {}

  @Post()
  createWorkoutExercise(
    @Param('workoutId') workoutId: string,
    @Body() data: CreateWorkoutExerciseDTO,
    @Req() req: types.AuthRequest,
  ): Promise<ViewWorkoutExerciseDTO> {
    return this.workoutExercisesService.createWorkoutExercise(
      req.user.sub,
      workoutId,
      data,
    );
  }

  @Get(':workoutExerciseId')
  getWorkoutExercise(
    @Param('workoutId') workoutId: string,
    @Param('workoutExerciseId')
    workoutExerciseId: string,
    @Req() req: types.AuthRequest,
  ): Promise<ViewWorkoutExerciseDTO> {
    return this.workoutExercisesService.getWorkoutExercise(
      req.user.sub,
      workoutId,
      workoutExerciseId,
    );
  }

  @Get()
  getWorkoutExercises(
    @Param('workoutId') workoutId: string,
    @Req() req: types.AuthRequest,
  ): Promise<ViewWorkoutExerciseDTO[]> {
    return this.workoutExercisesService.getWorkoutExercises(
      req.user.sub,
      workoutId,
    );
  }

  @Patch(':workoutExerciseId')
  updateWorkoutExercise(
    @Param('workoutId') workoutId: string,
    @Param('workoutExerciseId')
    workoutExerciseId: string,
    @Body() data: UpdateWorkoutExerciseDTO,
    @Req() req: types.AuthRequest,
  ): Promise<ViewWorkoutExerciseDTO> {
    return this.workoutExercisesService.updateWorkoutExercise(
      req.user.sub,
      workoutId,
      workoutExerciseId,
      data,
    );
  }

  @HttpCode(204)
  @Delete(':workoutExerciseId')
  deletWorkoutExercise(
    @Req() req: types.AuthRequest,
    @Param('workoutExerciseId') workoutExerciseId: string,
    @Param('workoutId') workoutId: string,
  ): Promise<void> {
    return this.workoutExercisesService.deleteWorkoutExercise(
      req.user.sub,
      workoutId,
      workoutExerciseId,
    );
  }
}
