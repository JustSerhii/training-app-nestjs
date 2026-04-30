import { Injectable, NotFoundException } from '@nestjs/common';
import { ViewExerciseDTO } from './dto';
import { PrismaService } from 'src/prisma';

@Injectable()
export class ExercisesService {
  constructor(private readonly prisma: PrismaService) {}

  async getMany(): Promise<ViewExerciseDTO[]> {
    return await this.prisma.exercise.findMany();
  }

  async getOne(id: string): Promise<ViewExerciseDTO> {
    const exercise = await this.prisma.exercise.findUnique({
      where: {
        id,
      },
    });

    if (!exercise) throw new NotFoundException('No such exercise in DB');
    return exercise;
  }
}
