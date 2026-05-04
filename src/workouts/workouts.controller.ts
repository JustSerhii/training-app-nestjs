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
  Req,
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

@UseGuards(AuthGuard)
@ApiBearerAuth(SWAGGER_BEARER_NAME)
@Controller('workouts')
export class WorkoutsController {
  constructor(private readonly workoutsService: WorkoutsService) {}

  @Post()
  createWorkout(
    @Req() req: types.AuthRequest,
    @Body() data: CreateWorkoutDTO,
  ): Promise<ViewWorkoutDTO> {
    return this.workoutsService.createWorkout(req.user.sub, data);
  }

  @Get()
  getWorkouts(
    @Req() req: types.AuthRequest,
    @Query() query: PaginationDto,
  ): Promise<PaginatedResponseDto<ViewWorkoutDTO>> {
    return this.workoutsService.getWorkouts(req.user.sub, query);
  }

  @Get(':workoutId/full')
  getFullWorkout(
    @Req() req: types.AuthRequest,
    @Param('workoutId') workoutId: string,
  ): Promise<ViewFullWorkoutDTO> {
    return this.workoutsService.getFullWorkout(req.user.sub, workoutId);
  }

  @Get(':workoutId')
  getWorkout(
    @Req() req: types.AuthRequest,
    @Param('workoutId') workoutId: string,
  ): Promise<ViewWorkoutDTO> {
    return this.workoutsService.getWorkout(req.user.sub, workoutId);
  }

  @HttpCode(204)
  @Delete(':workoutId')
  deleteWorkout(
    @Req() req: types.AuthRequest,
    @Param('workoutId') workoutId: string,
  ): Promise<void> {
    return this.workoutsService.deleteWorkout(req.user.sub, workoutId);
  }

  @Patch(':workoutId')
  updateWorkout(
    @Req() req: types.AuthRequest,
    @Body() data: UpdateWorkoutDTO,
    @Param('workoutId') workoutId: string,
  ): Promise<ViewWorkoutDTO> {
    return this.workoutsService.updateWorkout(req.user.sub, workoutId, data);
  }
}
