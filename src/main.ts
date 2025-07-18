import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PORT } from '@env';
import { GlobalExceptionInterceptor } from './interceptor';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new GlobalExceptionInterceptor());
  await app.listen(+PORT);
}

bootstrap()
  .then(() => {
    console.log(`Application is running on: http://localhost:${PORT}`);
  })
  .catch((error) => {
    console.error('Error occurred while starting the application:', error);
  });
