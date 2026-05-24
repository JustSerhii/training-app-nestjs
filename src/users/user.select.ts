import { Prisma } from '@prisma/client';

export const USER_SELECT = {
  id: true,
  name: true,
  email: true,
  bodyWeight: true,
  createdAt: true,
} satisfies Prisma.UserSelect;
