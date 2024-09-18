import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from '../enums/error-codes.enum';

export class CustomException extends HttpException {
  constructor(
    public errorCode: ErrorCode,
    public statusCode: HttpStatus,
    public message: string,
  ) {
    super(
      {
        success: false,
        errorCode,
        message,
      },
      statusCode,
    );
  }
}
