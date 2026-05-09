import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { PrismaModule } from './prisma';
import { ExercisesModule } from './exercises/exercises.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { WorkoutsModule } from './workouts/workouts.module';
import { WorkoutExercisesModule } from './workout-exercises/workout-exercises.module';
import { SetsModule } from './sets/sets.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    PrismaModule,
    ExercisesModule,
    AuthModule,
    UsersModule,
    WorkoutsModule,
    WorkoutExercisesModule,
    SetsModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
