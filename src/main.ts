import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './common';
import cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);

  if (config.getOrThrow<string>('APP_ENVIRONMENT') !== 'production') {
    setupSwagger(app);
  }

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.enableCors({
    origin: config.getOrThrow<string>('ALLOWED_ORIGIN'),
    credentials: true,
    exposedHeaders: ['set-cookie'],
  });

  app.use(cookieParser());

  await app.listen(config.getOrThrow<number>('APP_PORT'));
}
bootstrap();
