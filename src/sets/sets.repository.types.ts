import { Prisma, SetType } from '@prisma/client';
import { SET_SELECT } from './set.select';

export type SetEntity = Prisma.SetGetPayload<{
  select: typeof SET_SELECT;
}>;

export type CreateSetData = {
  weight?: number;
  reps: number;
  type?: SetType;
};

export type UpdateSetData = Partial<CreateSetData>;
