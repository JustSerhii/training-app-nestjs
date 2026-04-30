import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { CreateSetDTO, ReorderSetsDTO, UpdateSetDTO, ViewSetDTO } from './dto';
import { SetType } from '@prisma/client';
import { SET_SELECT } from './set.select';

const SET_NOT_FOUND = 'set not found';

@Injectable()
export class SetsService {
  constructor(private readonly prisma: PrismaService) {}

  private async assertWorkoutExerciseOwner(
    userId: string,
    workoutExerciseId: string,
  ) {
    const workoutExercise = await this.prisma.workoutExercise.findFirst({
      where: {
        id: workoutExerciseId,
        workout: {
          userId,
        },
      },
    });
    if (!workoutExercise) throw new ForbiddenException();
  }

  async createSet(
    userId: string,
    workoutExerciseId: string,
    data: CreateSetDTO,
  ): Promise<ViewSetDTO> {
    await this.assertWorkoutExerciseOwner(userId, workoutExerciseId);

    const lastSet = await this.prisma.set.findFirst({
      where: { workoutExerciseId },
      orderBy: { order: 'desc' },
    });

    const order = lastSet ? lastSet.order + 1 : 1;

    return await this.prisma.set.create({
      data: {
        weight: data.weight,
        reps: data.reps,
        type: data.type ?? SetType.normal,
        workoutExerciseId,
        order,
      },
      select: SET_SELECT,
    });
  }

  async getSet(
    userId: string,
    workoutExerciseId: string,
    setId: string,
  ): Promise<ViewSetDTO> {
    await this.assertWorkoutExerciseOwner(userId, workoutExerciseId);
    const set = await this.prisma.set.findFirst({
      where: {
        workoutExerciseId,
        id: setId,
      },
      select: SET_SELECT,
    });
    if (!set) throw new NotFoundException(SET_NOT_FOUND);
    return set;
  }

  async getSets(
    userId: string,
    workoutExerciseId: string,
  ): Promise<ViewSetDTO[]> {
    await this.assertWorkoutExerciseOwner(userId, workoutExerciseId);
    return this.prisma.set.findMany({
      where: {
        workoutExerciseId,
      },
      select: SET_SELECT,
      orderBy: { order: 'asc' },
    });
  }

  async updateSet(
    userId: string,
    workoutExerciseId: string,
    setId: string,
    data: UpdateSetDTO,
  ): Promise<ViewSetDTO> {
    await this.assertWorkoutExerciseOwner(userId, workoutExerciseId);

    const set = await this.prisma.set.findUnique({
      where: {
        id: setId,
      },
    });
    if (!set) throw new NotFoundException(SET_NOT_FOUND);

    return await this.prisma.set.update({
      where: {
        id: setId,
      },
      data,
      select: SET_SELECT,
    });
  }

  async deleteSet(
    userId: string,
    workoutExerciseId: string,
    setId: string,
  ): Promise<void> {
    await this.assertWorkoutExerciseOwner(userId, workoutExerciseId);

    const set = await this.prisma.set.findUnique({
      where: {
        id: setId,
      },
    });
    if (!set) throw new NotFoundException(SET_NOT_FOUND);
    await this.prisma.set.delete({
      where: {
        id: setId,
      },
    });
  }

  async reorderSets(
    userId: string,
    workoutExerciseId: string,
    data: ReorderSetsDTO,
  ): Promise<ViewSetDTO[]> {
    await this.assertWorkoutExerciseOwner(userId, workoutExerciseId);

    return await this.prisma.$transaction(
      data.sets.map((item) =>
        this.prisma.set.update({
          where: { id: item.id },
          data: { order: item.order },
          select: SET_SELECT,
        }),
      ),
    );
  }
}
