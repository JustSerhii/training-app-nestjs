import { Exercise, MuscleGroup } from '@prisma/client';
import { ExercisesService } from './exercises.service';
import { PrismaService } from 'src/prisma';
import { Test, TestingModule } from '@nestjs/testing';

const exerciseId = '9abd332b-1f88-463e-b057-0dde1ff31732';

const exercises: Exercise[] = [
  { id: exerciseId, title: 'Lat Pulldown', muscleGroups: [MuscleGroup.back] },
  {
    id: '23872837',
    title: 'Barbell Squat',
    muscleGroups: [MuscleGroup.quadriceps, MuscleGroup.glutes],
  },
  {
    id: '39383829',
    title: 'Overhead Press',
    muscleGroups: [MuscleGroup.shoulders, MuscleGroup.triceps],
  },
];

const exercise: Exercise = exercises[0];

const db = {
  exercise: {
    findMany: jest.fn().mockResolvedValue(exercises),
    findUnique: jest.fn().mockResolvedValue(exercise),
  },
};

describe('Exercise service', () => {
  let service: ExercisesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExercisesService,
        {
          provide: PrismaService,
          useValue: db,
        },
      ],
    }).compile();

    service = module.get<ExercisesService>(ExercisesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an array of exercises', async () => {
    const result = await service.getMany();
    expect(result).toEqual(exercises);
  });

  it('should return an exercise', async () => {
    const result = await service.getOne(exerciseId);
    expect(result).toEqual(exercise);
  });
});
