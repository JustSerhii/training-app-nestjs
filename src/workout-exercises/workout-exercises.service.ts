import {
  CreateWorkoutExerciseDTO,
  ViewWorkoutExerciseDTO,
  UpdateWorkoutExerciseDTO,
  ReorderWorkoutExercisesDTO,
} from './dto';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { WorkoutsExercisesRepository } from './workout-exercises.repository';
import { WorkoutsRepository } from 'src/workouts/workouts.repository';
import {
  CursorPageOptionsDto,
  CursorPaginatedResponseDto,
  CursorPaginationMetaDto,
} from 'src/common/dto/cursor-pagination';
import { decodeCursor, encodeCursor } from 'src/common/utils';
import { ExerciseRecordsService } from 'src/exercise-records/exercise-records.service';
import { SetsRepository } from 'src/sets/sets.repository';

const WORKOUT_EXERCISE_NOT_FOUND = 'no workout exercise found';

@Injectable()
export class WorkoutExercisesService {
  constructor(
    private readonly workoutExercisesRepository: WorkoutsExercisesRepository,
    private readonly workoutsRepository: WorkoutsRepository,
    private readonly exerciseRecordsService: ExerciseRecordsService,
    private readonly setsRepository: SetsRepository,
  ) {}

  async createWorkoutExercise(
    userId: string,
    workoutId: string,
    data: CreateWorkoutExerciseDTO,
  ): Promise<ViewWorkoutExerciseDTO> {
    await this.assertWorkoutOwner(userId, workoutId);

    const lastWorkoutExercise =
      await this.workoutExercisesRepository.findLastOne(workoutId);

    const order = lastWorkoutExercise ? lastWorkoutExercise.order + 1 : 1;

    return this.workoutExercisesRepository.create(workoutId, data, order);
  }

  async getWorkoutExercise(
    userId: string,
    workoutId: string,
    workoutExerciseId: string,
  ): Promise<ViewWorkoutExerciseDTO> {
    await this.assertWorkoutOwner(userId, workoutId);

    const workoutExercise = await this.workoutExercisesRepository.findFirst(
      workoutId,
      workoutExerciseId,
    );

    if (!workoutExercise)
      throw new NotFoundException(WORKOUT_EXERCISE_NOT_FOUND);
    return workoutExercise;
  }

  async getWorkoutExercises(
    userId: string,
    workoutId: string,
    options: CursorPageOptionsDto,
  ): Promise<CursorPaginatedResponseDto<ViewWorkoutExerciseDTO>> {
    await this.assertWorkoutOwner(userId, workoutId);

    let afterId: string | undefined;

    if (options.afterCursor) {
      afterId = decodeCursor(options.afterCursor);
    }

    const { data, lastId, total, hasNextPage } =
      await this.workoutExercisesRepository.findManyPaginatedByCursor(
        workoutId,
        {
          limit: options.limit,
          afterCursor: afterId,
        },
      );

    const nextCursor = lastId && hasNextPage ? encodeCursor(lastId) : undefined;
    const meta = new CursorPaginationMetaDto(options.limit, nextCursor, total);
    return new CursorPaginatedResponseDto(data, meta);
  }

  async updateWorkoutExercise(
    userId: string,
    workoutId: string,
    workoutExerciseId: string,
    data: UpdateWorkoutExerciseDTO,
  ): Promise<ViewWorkoutExerciseDTO> {
    await this.assertWorkoutOwner(userId, workoutId);
    const workoutExercise = await this.workoutExercisesRepository.findFirst(
      workoutId,
      workoutExerciseId,
    );
    if (!workoutExercise)
      throw new NotFoundException(WORKOUT_EXERCISE_NOT_FOUND);
    return this.workoutExercisesRepository.update(workoutExerciseId, data);
  }

  async deleteWorkoutExercise(
    userId: string,
    workoutId: string,
    workoutExerciseId: string,
  ): Promise<void> {
    await this.assertWorkoutOwner(userId, workoutId);

    const exercise =
      await this.workoutExercisesRepository.findExercise(workoutExerciseId);
    if (!exercise?.exerciseId) throw new NotFoundException('No such exercise');

    const allSetsBeforeDelete = await this.setsRepository.findAllSets(
      userId,
      exercise.exerciseId,
    );

    const count = await this.workoutExercisesRepository.deleteOne(
      workoutId,
      workoutExerciseId,
    );
    if (count === 0) throw new NotFoundException(WORKOUT_EXERCISE_NOT_FOUND);

    const remainingSets = allSetsBeforeDelete.filter(
      (s) => s.workoutExerciseId !== workoutExerciseId,
    );

    await this.exerciseRecordsService.recalculateRecord(
      userId,
      exercise.exerciseId,
      remainingSets,
    );
  }

  async reorderWorkoutExercises(
    userId: string,
    workoutId: string,
    data: ReorderWorkoutExercisesDTO,
  ): Promise<ViewWorkoutExerciseDTO[]> {
    await this.assertWorkoutOwner(userId, workoutId);
    const existing = await this.workoutExercisesRepository.findMany(workoutId);

    const existingIds = new Set(existing.map((item) => item.id));

    for (const id of data.workoutExercisesIds) {
      if (!existingIds.has(id))
        throw new NotFoundException(WORKOUT_EXERCISE_NOT_FOUND);
    }

    const uniqueIds = new Set(data.workoutExercisesIds);
    if (uniqueIds.size !== data.workoutExercisesIds.length)
      throw new BadRequestException('Dublicate orders');

    return this.workoutExercisesRepository.reorder(workoutId, data);
  }

  private async assertWorkoutOwner(
    userId: string,
    workoutId: string,
  ): Promise<void> {
    const workout = await this.workoutsRepository.findFirst(userId, workoutId);
    if (!workout) throw new ForbiddenException();
  }
}
