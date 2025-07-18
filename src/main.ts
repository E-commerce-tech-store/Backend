import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PORT } from '@env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api');

  await app.listen(+PORT);
}

bootstrap()
  .then(() => {
    console.log(`Application is running on: http://localhost:${PORT}`);
  })
  .catch((error) => {
    console.error('Error occurred while starting the application:', error);
  });
