import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import {
  ExerciseRecordInitital,
  ExerciseRecordUpdate,
} from './exericse-records.repository.types';

@Injectable()
export class ExerciseRecordRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findRecord(userId: string, exerciseId: string) {
    return this.prisma.exerciseRecord.findFirst({
      where: {
        userId,
        exerciseId,
      },
    });
  }

  async upsertRecord(
    userId: string,
    exerciseId: string,
    updates: ExerciseRecordUpdate,
    initial: ExerciseRecordInitital,
  ) {
    return this.prisma.exerciseRecord.upsert({
      where: { userId_exerciseId: { userId, exerciseId } },
      update: updates,
      create: {
        userId,
        exerciseId,
        ...initial,
      },
    });
  }

  async deleteRecord(userId: string, exerciseId: string) {
    return this.prisma.exerciseRecord.delete({
      where: {
        userId_exerciseId: {
          userId,
          exerciseId,
        },
      },
    });
  }

  async findAllRecordsByUser(userId: string) {
    return this.prisma.exerciseRecord.findMany({
      where: {
        userId,
      },
      select: {
        maxWeight: true,
        maxReps: true,
        maxVolume: true,
        exerciseId: true,
      },
    });
  }
}
