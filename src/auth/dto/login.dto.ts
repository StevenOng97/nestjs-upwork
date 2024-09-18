// import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  @Transform(
    ({ value }: TransformFnParams) => value?.trim() && value?.toLowerCase(),
  )
  @IsEmail()
  @IsNotEmpty()
  //   @ApiProperty({ type: String })
  email: string;

  @IsString()
  @IsNotEmpty()
  //   @ApiProperty({ type: String })
  password: string;
}
