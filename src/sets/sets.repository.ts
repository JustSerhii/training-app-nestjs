import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { CreateSetDTO, ReorderSetsDTO, UpdateSetDTO, ViewSetDTO } from './dto';
import { SetType } from '@prisma/client';
import { SET_SELECT } from './set.select';

@Injectable()
export class SetsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    workoutExerciseId: string,
    data: CreateSetDTO,
    order: number,
  ): Promise<ViewSetDTO> {
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
  ): Promise<ViewSetDTO | null> {
    return this.prisma.set.findFirst({
      where: {
        workoutExerciseId,
        id: setId,
      },
      select: SET_SELECT,
    });
  }

  async findMany(workoutExerciseId: string): Promise<ViewSetDTO[]> {
    return this.prisma.set.findMany({
      where: {
        workoutExerciseId,
      },
      orderBy: { order: 'asc' },
      select: SET_SELECT,
    });
  }

  async update(setId: string, data: UpdateSetDTO): Promise<ViewSetDTO> {
    return this.prisma.set.update({
      where: {
        id: setId,
      },
      data,
      select: SET_SELECT,
    });
  }

  async deleteOne(workoutExerciseId: string, setId: string): Promise<number> {
    const { count } = await this.prisma.set.deleteMany({
      where: {
        workoutExerciseId,
        id: setId,
      },
    });
    return count;
  }

  async reorder(
    data: ReorderSetsDTO,
    workoutExerciseId: string,
  ): Promise<ViewSetDTO[]> {
    return this.prisma.$transaction(
      data.sets.map((item) =>
        this.prisma.set.update({
          where: { id: item.id, workoutExerciseId },
          data: { order: item.order },
          select: SET_SELECT,
        }),
      ),
    );
  }
}
