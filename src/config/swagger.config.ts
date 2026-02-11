import type { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export async function createSwagger(app: INestApplication): Promise<void> {
  const config = new DocumentBuilder()
    .setTitle('Документация Pay-flow')
    .setDescription('Pay-flow API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}
