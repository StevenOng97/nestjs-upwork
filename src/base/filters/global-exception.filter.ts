import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { CustomException } from '../exceptions/custom-exceptions';
import { ErrorCode } from '../enums/error-codes.enum';
import { ApiResponse } from 'src/interfaces/api-response.interface';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorCode = ErrorCode.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let success = false;

    if (exception instanceof CustomException) {
      const errorResponse = exception.getResponse() as {
        errorCode: ErrorCode;
        message: string;
      };
      status = exception.getStatus();
      errorCode = errorResponse.errorCode;
      message = errorResponse.message;
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const errorResponse = exception.getResponse() as {
        message: string | string[];
        error: string;
      };
      message = Array.isArray(errorResponse.message)
        ? errorResponse.message[0]
        : errorResponse.message || errorResponse.error;

      switch (status) {
        case HttpStatus.UNAUTHORIZED:
          errorCode = ErrorCode.UNAUTHORIZED;
          break;
        case HttpStatus.NOT_FOUND:
          errorCode = ErrorCode.NOT_FOUND;
          break;
      }
    }

    const errorResponse: ApiResponse<null> = {
      success,
      message,
      errorCode,
    };

    response.status(status).json(errorResponse);
  }
}
