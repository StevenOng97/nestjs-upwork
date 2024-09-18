import { ErrorCode } from 'src/base/enums/error-codes.enum';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errorCode?: ErrorCode;
}