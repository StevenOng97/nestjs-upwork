import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { IUserRepository } from './user.repository.interface';
import { User as PrismaUser } from '@prisma/client';
import { BaseRepository } from 'src/base/repositories/base.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from 'src/interfaces/user.interface';
import { ApiResponse } from 'src/interfaces/api-response.interface';
import { CustomException } from 'src/base/exceptions/custom-exceptions';
import { ErrorCode } from 'src/base/enums/error-codes.enum';
@Injectable()
export class UserRepository
  extends BaseRepository<User>
  implements IUserRepository
{
  constructor(prisma: DatabaseService) {
    super(prisma, 'user');
  }

  async create(data: CreateUserDto): Promise<ApiResponse<User>> {
    try {
      const user = await this.prisma.$transaction(async (tx) => {
        const payload = {
          email: data.email,
          password: data.password,
        };

        const user = await tx.user.create({
          data: payload,
        });

        await tx.oAuthAccount.create({
          data: {
            provider: data.provider,
            userId: user.id,
          },
        });
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });

      return {
        success: true,
        message: 'User created successfully',
        data: user,
      };
    } catch (error) {
      throw new CustomException(
        ErrorCode.DATABASE_ERROR,
        500,
        `Error creating user: ${error.message}`,
      );
    }
  }

  async findByEmail(email: string): Promise<ApiResponse<PrismaUser | null>> {
    try {
      const user = await this.prisma.user.findUnique({ where: { email } });
      return {
        success: true,
        message: 'User found',
        data: user,
      };
    } catch (error) {
      throw new CustomException(
        ErrorCode.DATABASE_ERROR,
        500,
        `Error finding user: ${error.message}`,
      );
    }
  }
}
