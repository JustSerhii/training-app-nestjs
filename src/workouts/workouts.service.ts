import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWorkoutDTO, UpdateWorkoutDTO, ViewWorkoutDTO } from './dto';
import { ViewFullWorkoutDTO } from './dto/ViewFullWorkoutDTO.dto';
import { WorkoutsRepository } from './workouts.repository';
import {
  PaginatedResponseDto,
  PaginationDto,
  PaginationMetaDto,
} from 'src/common/dto/offset-pagination';

const WORKOUT_NOT_FOUND = 'workout not found';

@Injectable()
export class WorkoutsService {
  constructor(private readonly workoutsRepository: WorkoutsRepository) {}

  async createWorkout(
    userId: string,
    data: CreateWorkoutDTO,
  ): Promise<ViewWorkoutDTO> {
    return this.workoutsRepository.create(userId, data);
  }

  async getWorkouts(
    userId: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResponseDto<ViewWorkoutDTO>> {
    const { data, total } = await this.workoutsRepository.findManyPaginated(
      userId,
      pagination,
    );

    const meta = new PaginationMetaDto(
      total,
      pagination.page,
      pagination.limit,
    );

    return new PaginatedResponseDto(data, meta);
  }

  async getWorkout(userId: string, workoutId: string): Promise<ViewWorkoutDTO> {
    return this.findOrFail(userId, workoutId);
  }

  async getFullWorkout(
    userId: string,
    workoutId: string,
  ): Promise<ViewFullWorkoutDTO> {
    const workout = await this.workoutsRepository.findFull(userId, workoutId);
    if (!workout) throw new NotFoundException(WORKOUT_NOT_FOUND);
    return workout;
  }

  async deleteWorkout(userId: string, workoutId: string): Promise<void> {
    const count = await this.workoutsRepository.deleteOne(userId, workoutId);
    if (count === 0) throw new NotFoundException(WORKOUT_NOT_FOUND);
  }

  async updateWorkout(
    userId: string,
    workoutId: string,
    data: UpdateWorkoutDTO,
  ): Promise<ViewWorkoutDTO> {
    await this.findOrFail(userId, workoutId);

    return this.workoutsRepository.update(workoutId, data);
  }

  private async findOrFail(
    userId: string,
    workoutId: string,
  ): Promise<ViewWorkoutDTO> {
    const workout = await this.workoutsRepository.findFirst(userId, workoutId);
    if (!workout) throw new NotFoundException(WORKOUT_NOT_FOUND);
    return workout;
  }
}
