import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSetDTO, ReorderSetsDTO, UpdateSetDTO, ViewSetDTO } from './dto';
import { SetsRepository } from './sets.repository';
import { WorkoutsExercisesRepository } from 'src/workout-exercises/workout-exercises.repository';
import { ExerciseRecordRepository } from 'src/exercise-records/exercise-records.repository';
import { ExerciseRecordDTO } from 'src/exercise-records/dto';
import { ExerciseSessionsService } from 'src/exercise-sessions/exercise-sessions.service';
import { calculateSetWeight } from 'src/common/utils';
import { PrismaService } from 'src/prisma';

const SET_NOT_FOUND = 'set not found';
const EXERCISE_NOT_FOUND = 'No such exercise';

@Injectable()
export class SetsService {
  constructor(
    private readonly setsRepository: SetsRepository,
    private readonly workoutExercisesRepository: WorkoutsExercisesRepository,
    private readonly exerciseRecordsRepository: ExerciseRecordRepository,
    private readonly exerciseSessionsService: ExerciseSessionsService,
    private readonly prisma: PrismaService,
  ) {}

  async createSet(
    userId: string,
    workoutExerciseId: string,
    data: CreateSetDTO,
  ): Promise<ViewSetDTO> {
    await this.assertWorkoutExerciseOwner(userId, workoutExerciseId);

    const workoutExercise =
      await this.workoutExercisesRepository.findById(workoutExerciseId);

    if (!workoutExercise) {
      throw new NotFoundException('Workout exercise not found');
    }

    const lastSet = await this.setsRepository.findLastOne(workoutExerciseId);

    const order = lastSet ? lastSet.order + 1 : 1;

    const set = await this.setsRepository.create(
      workoutExerciseId,
      data,
      order,
    );

    const exercise =
      await this.workoutExercisesRepository.findExercise(workoutExerciseId);
    if (!exercise?.exerciseId) throw new NotFoundException(EXERCISE_NOT_FOUND);

    const [user, exerciseDetails] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: userId },
        select: { bodyWeight: true },
      }),
      this.prisma.exercise.findUnique({
        where: { id: exercise.exerciseId },
        select: { isBodyWeight: true },
      }),
    ]);

    const calculatedWeight = calculateSetWeight(
      set.weight,
      exerciseDetails?.isBodyWeight ?? false,
      user?.bodyWeight ?? null,
    );

    const record = await this.exerciseRecordsRepository.findRecord(
      userId,
      exercise.exerciseId,
    );

    if (!record) {
      await this.exerciseRecordsRepository.upsertRecord(
        userId,
        exercise.exerciseId,
        {},
        {
          maxWeight: calculatedWeight,
          maxReps: set.reps,
          bestWeight: calculatedWeight,
          bestReps: set.reps,
          maxVolume: calculatedWeight * set.reps,
        },
      );
    } else {
      const updates = ExerciseRecordDTO.calcUpdates(
        record,
        calculatedWeight,
        set.reps,
      );
      if (updates) {
        await this.exerciseRecordsRepository.upsertRecord(
          userId,
          exercise.exerciseId,
          updates,
          {
            maxWeight: record.maxWeight,
            maxReps: record.maxReps,
            bestWeight: record.bestWeight,
            bestReps: record.bestReps,
            maxVolume: record.maxVolume,
          },
        );
      }
    }

    await this.exerciseSessionsService.recalculateSessionsForWorkout(
      userId,
      workoutExercise.workoutId,
    );

    return set;
  }

  async getSet(
    userId: string,
    workoutExerciseId: string,
    setId: string,
  ): Promise<ViewSetDTO> {
    await this.assertWorkoutExerciseOwner(userId, workoutExerciseId);
    const set = await this.setsRepository.findFirst(workoutExerciseId, setId);
    if (!set) throw new NotFoundException(SET_NOT_FOUND);
    return set;
  }

  async getSets(
    userId: string,
    workoutExerciseId: string,
  ): Promise<ViewSetDTO[]> {
    await this.assertWorkoutExerciseOwner(userId, workoutExerciseId);
    return this.setsRepository.findMany(workoutExerciseId);
  }

  async updateSet(
    userId: string,
    workoutExerciseId: string,
    setId: string,
    data: UpdateSetDTO,
  ): Promise<ViewSetDTO> {
    await this.assertWorkoutExerciseOwner(userId, workoutExerciseId);

    const set = await this.setsRepository.findFirst(workoutExerciseId, setId);
    if (!set) throw new NotFoundException(SET_NOT_FOUND);

    return this.setsRepository.update(setId, data);
  }

  async deleteSet(
    userId: string,
    workoutExerciseId: string,
    setId: string,
  ): Promise<void> {
    await this.assertWorkoutExerciseOwner(userId, workoutExerciseId);

    const count = await this.setsRepository.deleteOne(workoutExerciseId, setId);
    if (count === 0) throw new NotFoundException(SET_NOT_FOUND);

    const exercise =
      await this.workoutExercisesRepository.findExercise(workoutExerciseId);
    if (!exercise?.exerciseId) throw new NotFoundException(EXERCISE_NOT_FOUND);

    const allSets = await this.setsRepository.findAllSets(
      userId,
      exercise.exerciseId,
    );

    if (allSets.length === 0) {
      await this.exerciseRecordsRepository.deleteRecord(
        userId,
        exercise.exerciseId,
      );

      const workoutExercise =
        await this.workoutExercisesRepository.findById(workoutExerciseId);
      if (workoutExercise) {
        await this.exerciseSessionsService.recalculateSessionsForWorkout(
          userId,
          workoutExercise.workoutId,
        );
      }
      return;
    }

    const newRecord = allSets.reduce(
      (best, set) => {
        const weight = set.weight ?? 0;
        const volume = weight * set.reps;
        const oneRepMax = ExerciseRecordDTO.calcOneRepMax(weight, set.reps);
        const bestOneRepMax = ExerciseRecordDTO.calcOneRepMax(
          best.bestWeight,
          best.bestReps,
        );

        return {
          maxWeight: Math.max(best.maxWeight, weight),
          maxReps:
            weight >= best.maxWeight
              ? Math.max(best.maxReps, set.reps)
              : best.maxReps,
          bestWeight: oneRepMax > bestOneRepMax ? weight : best.bestWeight,
          bestReps: oneRepMax > bestOneRepMax ? set.reps : best.bestReps,
          maxVolume: Math.max(best.maxVolume, volume),
        };
      },
      { maxWeight: 0, maxReps: 0, bestWeight: 0, bestReps: 0, maxVolume: 0 },
    );

    await this.exerciseRecordsRepository.upsertRecord(
      userId,
      exercise.exerciseId,
      newRecord,
      newRecord,
    );

    const workoutExercise =
      await this.workoutExercisesRepository.findById(workoutExerciseId);
    if (workoutExercise) {
      await this.exerciseSessionsService.recalculateSessionsForWorkout(
        userId,
        workoutExercise.workoutId,
      );
    }
  }

  async reorderSets(
    userId: string,
    workoutExerciseId: string,
    data: ReorderSetsDTO,
  ): Promise<ViewSetDTO[]> {
    await this.assertWorkoutExerciseOwner(userId, workoutExerciseId);

    const existingSets = await this.setsRepository.findMany(workoutExerciseId);

    const existingIds = new Set(existingSets.map((s) => s.id));

    for (const id of data.setIds) {
      if (!existingIds.has(id)) {
        throw new NotFoundException(SET_NOT_FOUND);
      }
    }
    const uniqueIds = new Set(data.setIds);

    if (uniqueIds.size !== data.setIds.length)
      throw new BadRequestException('Dublicate orders');

    return this.setsRepository.reorder(data, workoutExerciseId);
  }

  private async assertWorkoutExerciseOwner(
    userId: string,
    workoutExerciseId: string,
  ) {
    const exists = await this.workoutExercisesRepository.existsByOwner(
      userId,
      workoutExerciseId,
    );
    if (!exists) throw new ForbiddenException();
  }
}
