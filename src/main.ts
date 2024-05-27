import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options: SwaggerDocumentOptions =  {
    operationIdFactory: (
      controllerKey: string,
      methodKey: string
    ) => methodKey
  };

  const config = new DocumentBuilder()
    .setTitle('Email Notifier API')
    .setDescription('Notify user about email from intended email address')
    .setVersion('1.0')
    .addTag('gmail')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/doc', app, document);

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}

bootstrap();
