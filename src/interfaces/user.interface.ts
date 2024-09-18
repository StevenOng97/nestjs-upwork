import { User as UserPrisma } from '@prisma/client';

export type User = Omit<UserPrisma, 'password'>;
