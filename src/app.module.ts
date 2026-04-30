import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma';
import { ExercisesModule } from './exercises/exercises.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { WorkoutsModule } from './workouts/workouts.module';
import { WorkoutExercisesModule } from './workout-exercises/workout-exercises.module';
import { SetsModule } from './sets/sets.module';

@Module({
  imports: [
    PrismaModule,
    ExercisesModule,
    AuthModule,
    UsersModule,
    WorkoutsModule,
    WorkoutExercisesModule,
    SetsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
