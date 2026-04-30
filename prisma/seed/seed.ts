import { PrismaClient } from '@prisma/client';
import { seedExercises } from './seed-exercises';

const main = async (): Promise<void> => {
  const prisma = new PrismaClient();

  try {
    await seedExercises(prisma);
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
};

void main();
