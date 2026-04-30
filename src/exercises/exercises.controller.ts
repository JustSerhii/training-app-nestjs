import { Controller, Get, Param } from '@nestjs/common';
import { ExercisesService } from './exercises.service';
import { ViewExerciseDTO } from './dto';

@Controller('exercises')
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Get()
  getMany(): Promise<ViewExerciseDTO[]> {
    return this.exercisesService.getMany();
  }

  @Get(':id')
  getOne(@Param('id') id: string): Promise<ViewExerciseDTO> {
    return this.exercisesService.getOne(id);
  }
}
