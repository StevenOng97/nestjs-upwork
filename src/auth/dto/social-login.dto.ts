import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { Provider } from '@prisma/client';

export class SocialLoginDto {
  @IsNotEmpty()
  @IsEnum(Provider)
  provider: Provider;

  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim().toLowerCase())
  @ValidateIf((o) => o.email != null)
  @IsString()
  email?: string;

  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  firstName?: string;

  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  lastName?: string;
}
