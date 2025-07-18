import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class GlobalExceptionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(catchError((error: unknown) => this.handleError(error)));
  }

  handleError(error: unknown) {
    if (error instanceof HttpException) {
      return throwError(() => error);
    }

    let errorMessage = 'Unknown error';

    if (typeof error === 'object' && error !== null && 'message' in error) {
      errorMessage = String((error as { message: unknown }).message);
    } else if (typeof error === 'string') {
      errorMessage = error;
    }

    return throwError(
      () =>
        new HttpException(
          {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Internal server error',
            error: errorMessage,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
    );
  }
}
