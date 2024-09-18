import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { UniqueEmail } from '../validators/unique-email.validator';
import { Provider } from '@prisma/client';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @UniqueEmail()
  email: string;

  @IsEnum(Provider, {
    message: 'Valid provider required',
  })
  @IsNotEmpty()
  provider: Provider;

  @IsString()
  @IsOptional()
  password?: string;
}
