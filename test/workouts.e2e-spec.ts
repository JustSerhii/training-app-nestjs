/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { PrismaService } from 'src/prisma';
import { CreateWorkoutDTO } from 'src/workouts/dto';

const dto: CreateWorkoutDTO = {
  title: 'Pull Workout',
  description: 'Evening workout',
};

describe('WorkoutsController (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    prisma = app.get(PrismaService);

    await prisma.set.deleteMany();
    await prisma.workoutExercise.deleteMany();
    await prisma.workout.deleteMany();
    await prisma.user.deleteMany();

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ name: 'Test', email: 'test@test.com', password: 'Test1234!' });

    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@test.com', password: 'Test1234!' });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    token = loginRes.body.token;
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /workouts - should create a workout', async () => {
    const response = await request(app.getHttpServer())
      .post('/workouts')
      .set('Authorization', `Bearer ${token}`)
      .send(dto)
      .expect(201);

    expect(response.body).toMatchObject(dto);
    expect(response.body).toHaveProperty('id');
  });

  it('GET /workouts/:workoutid - should return 404 if workout not found', async () => {
    await request(app.getHttpServer())
      .get('/workouts/00000000-0000-0000-0000-000000000000')
      .set('Authorization', `Bearer ${token}`)
      .expect(404);
  });

  it('GET /workouts/:workoutId - should return a workout by id', async () => {
    const created = await request(app.getHttpServer())
      .post('/workouts')
      .set('Authorization', `Bearer ${token}`)
      .send(dto)
      .expect(201);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const workoutId = created.body.id;

    const response = await request(app.getHttpServer())
      .get(`/workouts/${workoutId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toMatchObject({
      id: workoutId,
      title: dto.title,
      description: dto.description,
    });
  });
});
