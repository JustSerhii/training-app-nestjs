import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWorkoutDTO, UpdateWorkoutDTO, ViewWorkoutDTO } from './dto';
import { ViewFullWorkoutDTO } from './dto/ViewFullWorkoutDTO.dto';
import { WorkoutsRepository } from './workouts.repository';
import {
  PaginatedResponseDto,
  PaginationDto,
  PaginationMetaDto,
} from 'src/common/dto/offset-pagination';
import { SetsRepository } from 'src/sets/sets.repository';
import { ExerciseRecordsService } from 'src/exercise-records/exercise-records.service';
import { ExerciseSessionsService } from 'src/exercise-sessions/exercise-sessions.service';

const WORKOUT_NOT_FOUND = 'workout not found';

@Injectable()
export class WorkoutsService {
  constructor(
    private readonly workoutsRepository: WorkoutsRepository,
    private readonly setsRepository: SetsRepository,
    private readonly exerciseRecordsService: ExerciseRecordsService,
    private readonly exerciseSessionsService: ExerciseSessionsService,
  ) {}

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
    const totalVolume =
      (await this.exerciseSessionsService.getWorkoutTotalVolume(workoutId)) ??
      0;

    return { ...workout, totalVolume };
  }

  async deleteWorkout(userId: string, workoutId: string): Promise<void> {
    const workoutExercises =
      await this.workoutsRepository.findWorkoutExerciseIds(workoutId);
    const exerciseIds = [
      ...new Set(workoutExercises.map((we) => we.exerciseId)),
    ];

    const setsByExercise = await Promise.all(
      exerciseIds.map(async (exerciseId) => ({
        exerciseId,
        sets: await this.setsRepository.findAllSets(userId, exerciseId),
      })),
    );

    const count = await this.workoutsRepository.deleteOne(userId, workoutId);
    if (count === 0) throw new NotFoundException(WORKOUT_NOT_FOUND);
    if (setsByExercise.length <= 0) return;

    await Promise.all(
      setsByExercise.map(({ exerciseId, sets }) => {
        const remainingSets = sets.filter(
          (s) => !workoutExercises.some((we) => we.id === s.workoutExerciseId),
        );
        return this.exerciseRecordsService.updateOrDeleteRecord(
          userId,
          exerciseId,
          remainingSets,
        );
      }),
    );
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
