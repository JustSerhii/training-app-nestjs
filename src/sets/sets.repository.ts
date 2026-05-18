import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { ReorderSetsDTO } from './dto';
import { SetType } from '@prisma/client';
import { SET_SELECT } from './set.select';
import {
  CreateSetData,
  SetEntity,
  UpdateSetData,
} from './sets.repository.types';

@Injectable()
export class SetsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    workoutExerciseId: string,
    data: CreateSetData,
    order: number,
  ): Promise<SetEntity> {
    return this.prisma.set.create({
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

  async findLastOne(
    workoutExerciseId: string,
  ): Promise<{ order: number } | null> {
    return this.prisma.set.findFirst({
      where: { workoutExerciseId },
      orderBy: { order: 'desc' },
      select: { order: true },
    });
  }

  async findFirst(
    workoutExerciseId: string,
    setId: string,
  ): Promise<SetEntity | null> {
    return this.prisma.set.findFirst({
      where: {
        workoutExerciseId,
        id: setId,
      },
      select: SET_SELECT,
    });
  }

  async findMany(workoutExerciseId: string): Promise<SetEntity[]> {
    return this.prisma.set.findMany({
      where: {
        workoutExerciseId,
      },
      orderBy: { order: 'asc' },
      select: SET_SELECT,
    });
  }

  async findAllSets(userId: string, exerciseId: string) {
    return this.prisma.set.findMany({
      where: {
        workoutExercise: {
          exerciseId,
          workout: {
            userId,
          },
        },
      },
      select: {
        weight: true,
        reps: true,
        workoutExerciseId: true,
      },
    });
  }

  async update(setId: string, data: UpdateSetData): Promise<SetEntity> {
    return this.prisma.set.update({
      where: {
        id: setId,
      },
      data,
      select: SET_SELECT,
    });
  }

  async deleteOne(workoutExerciseId: string, setId: string): Promise<number> {
    const setToDelete = await this.prisma.set.findFirst({
      where: {
        workoutExerciseId,
        id: setId,
      },
      select: {
        order: true,
        workoutExerciseId: true,
      },
    });

    if (!setToDelete) return 0;

    return this.prisma.$transaction(async (tx) => {
      const { count } = await tx.set.deleteMany({
        where: {
          workoutExerciseId,
          id: setId,
        },
      });
      if (count > 0) {
        await tx.set.updateMany({
          where: {
            workoutExerciseId,
            order: { gt: setToDelete.order },
          },
          data: {
            order: { decrement: 1 },
          },
        });
      }
      return count;
    });
  }

  async reorder(
    data: ReorderSetsDTO,
    workoutExerciseId: string,
  ): Promise<SetEntity[]> {
    return this.prisma.$transaction(
      data.setIds.map((id, index) =>
        this.prisma.set.update({
          where: { id, workoutExerciseId },
          data: { order: index + 1 },
          select: SET_SELECT,
        }),
      ),
    );
  }
}
