import { IBaseRepository } from 'src/base/repositories/base.repository.interface';
import { User as PrismaUser } from '@prisma/client';
import { User } from 'src/interfaces/user.interface';
import { CreateUserDto } from '../dto/create-user.dto';
import { ApiResponse } from 'src/interfaces/api-response.interface';

export interface IUserRepository extends IBaseRepository<User> {
  create(data: CreateUserDto): Promise<ApiResponse<User>>;
  findByEmail(email: string): Promise<ApiResponse<PrismaUser | null>>;
}
