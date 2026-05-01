import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export const SWAGGER_BEARER_NAME = 'userAuth';

export const setupSwagger = (app: INestApplication): void => {
  const config = new DocumentBuilder()
    .setTitle('Training application')
    .setDescription('The app API description')
    .setVersion('0.0.1')
    .addBearerAuth(undefined, SWAGGER_BEARER_NAME)
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
};
