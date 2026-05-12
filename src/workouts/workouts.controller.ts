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
import { CreateWorkoutDTO, UpdateWorkoutDTO, ViewWorkoutDTO } from './dto';
import { WorkoutsService } from './workouts.service';
import { AuthGuard } from 'src/auth/guards';
import * as types from 'src/auth/types';
import { ViewFullWorkoutDTO } from './dto/ViewFullWorkoutDTO.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { SWAGGER_BEARER_NAME } from 'src/common';
import {
  PaginatedResponseDto,
  PaginationDto,
} from 'src/common/dto/offset-pagination';
import { User } from 'src/decorators';

@UseGuards(AuthGuard)
@ApiBearerAuth(SWAGGER_BEARER_NAME)
@Controller('workouts')
export class WorkoutsController {
  constructor(private readonly workoutsService: WorkoutsService) {}

  @Post()
  createWorkout(
    @User() user: types.JwtPayload,
    @Body() data: CreateWorkoutDTO,
  ): Promise<ViewWorkoutDTO> {
    return this.workoutsService.createWorkout(user.sub, data);
  }

  @Get()
  getWorkouts(
    @User() user: types.JwtPayload,
    @Query() query: PaginationDto,
  ): Promise<PaginatedResponseDto<ViewWorkoutDTO>> {
    return this.workoutsService.getWorkouts(user.sub, query);
  }

  @Get(':workoutId/full')
  getFullWorkout(
    @User() user: types.JwtPayload,
    @Param('workoutId') workoutId: string,
  ): Promise<ViewFullWorkoutDTO> {
    return this.workoutsService.getFullWorkout(user.sub, workoutId);
  }

  @Get(':workoutId')
  getWorkout(
    @User() user: types.JwtPayload,
    @Param('workoutId') workoutId: string,
  ): Promise<ViewWorkoutDTO> {
    return this.workoutsService.getWorkout(user.sub, workoutId);
  }

  @HttpCode(204)
  @Delete(':workoutId')
  deleteWorkout(
    @User() user: types.JwtPayload,
    @Param('workoutId') workoutId: string,
  ): Promise<void> {
    return this.workoutsService.deleteWorkout(user.sub, workoutId);
  }

  @Patch(':workoutId')
  updateWorkout(
    @User() user: types.JwtPayload,
    @Body() data: UpdateWorkoutDTO,
    @Param('workoutId') workoutId: string,
  ): Promise<ViewWorkoutDTO> {
    return this.workoutsService.updateWorkout(user.sub, workoutId, data);
  }
}
