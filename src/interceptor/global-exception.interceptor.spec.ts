import { HttpException, HttpStatus } from '@nestjs/common';
import { GlobalExceptionInterceptor } from './global-exception.interceptor';
import { firstValueFrom } from 'rxjs';

describe('GlobalExceptionInterceptor', () => {
  it('should be defined', () => {
    expect(new GlobalExceptionInterceptor()).toBeDefined();
  });

  it('should handle HttpException', async () => {
    const interceptor = new GlobalExceptionInterceptor();
    const error = new HttpException('Test error', HttpStatus.BAD_REQUEST);
    await expect(
      firstValueFrom(interceptor.handleError(error)),
    ).rejects.toThrow(error);
  });

  it('should handle generic errors as internal server error', async () => {
    const interceptor = new GlobalExceptionInterceptor();
    const errorMessage = 'Some unexpected error';
    const error = new Error(errorMessage);

    await expect(
      firstValueFrom(interceptor.handleError(error)),
    ).rejects.toMatchObject({
      response: {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        error: errorMessage,
      },
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  });

  it('should handle string errors', async () => {
    const interceptor = new GlobalExceptionInterceptor();
    const errorMessage = 'String error';

    await expect(
      firstValueFrom(interceptor.handleError(errorMessage)),
    ).rejects.toMatchObject({
      response: {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        error: errorMessage,
      },
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  });

  it('should handle null and undefined errors', async () => {
    const interceptor = new GlobalExceptionInterceptor();

    await expect(
      firstValueFrom(interceptor.handleError(null)),
    ).rejects.toMatchObject({
      response: {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        error: 'Unknown error',
      },
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    });

    await expect(
      firstValueFrom(interceptor.handleError(undefined)),
    ).rejects.toMatchObject({
      response: {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        error: 'Unknown error',
      },
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  });

  it('should handle errors without message property', async () => {
    const interceptor = new GlobalExceptionInterceptor();
    const error = { code: 123, data: 'Some data' };

    await expect(
      firstValueFrom(interceptor.handleError(error)),
    ).rejects.toMatchObject({
      response: {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        error: 'Unknown error',
      },
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  });

  it('should handle errors with message property', async () => {
    const interceptor = new GlobalExceptionInterceptor();
    const error = { message: 'Error with message property' };

    await expect(
      firstValueFrom(interceptor.handleError(error)),
    ).rejects.toMatchObject({
      response: {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        error: 'Error with message property',
      },
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  });

  it('should handle errors with non-string message property', async () => {
    const interceptor = new GlobalExceptionInterceptor();
    const error = { message: 12345 };

    await expect(
      firstValueFrom(interceptor.handleError(error)),
    ).rejects.toMatchObject({
      response: {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        error: '12345',
      },
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  });
});
