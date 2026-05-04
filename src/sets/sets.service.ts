import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSetDTO, ReorderSetsDTO, UpdateSetDTO, ViewSetDTO } from './dto';
import { SetsRepository } from './sets.repository';
import { WorkoutsExercisesRepository } from 'src/workout-exercises/workout-exercises.repository';

const SET_NOT_FOUND = 'set not found';

@Injectable()
export class SetsService {
  constructor(
    private readonly setsRepository: SetsRepository,
    private readonly workoutExercisesRepository: WorkoutsExercisesRepository,
  ) {}

  async createSet(
    userId: string,
    workoutExerciseId: string,
    data: CreateSetDTO,
  ): Promise<ViewSetDTO> {
    await this.assertWorkoutExerciseOwner(userId, workoutExerciseId);

    const lastSet = await this.setsRepository.findLastOne(workoutExerciseId);

    const order = lastSet ? lastSet.order + 1 : 1;

    return await this.setsRepository.create(workoutExerciseId, data, order);
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
