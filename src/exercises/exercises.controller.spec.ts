import { Test, TestingModule } from '@nestjs/testing';
import { ExercisesController } from './exercises.controller';
import { ExercisesService } from './exercises.service';
import { NotFoundException } from '@nestjs/common';
import { MuscleGroup } from '@prisma/client';

const exerciseId = '9abd332b-1f88-463e-b057-0dde1ff31732';

const exercise = {
  id: exerciseId,
  title: 'Pull-ups',
  muscleGroups: [MuscleGroup.back, MuscleGroup.biceps],
};

describe('Exercise controller', () => {
  let controller: ExercisesController;
  let service: ExercisesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExercisesController],
      providers: [
        {
          provide: ExercisesService,
          useValue: {
            getMany: jest.fn().mockResolvedValue([exercise]),
            getOne: jest.fn().mockResolvedValue(exercise),
          },
        },
      ],
    }).compile();

    controller = module.get<ExercisesController>(ExercisesController);
    service = module.get<ExercisesService>(ExercisesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return an array of exercises', async () => {
    const result = await controller.getMany();
    expect(result).toEqual([exercise]);
  });

  it('should return an exercise', async () => {
    const result = await controller.getOne(exerciseId);
    expect(result).toEqual(exercise);
  });

  it('should throw an exception if exercise not found', async () => {
    jest
      .spyOn(service, 'getOne')
      .mockRejectedValueOnce(new NotFoundException('exercise not found'));

    try {
      await controller.getOne('12345');
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect((error as NotFoundException).message).toBe('exercise not found');
    }
  });
});
