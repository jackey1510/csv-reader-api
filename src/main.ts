import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import multer from 'multer';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('BookYeah')
    .setDescription('The BookYeah API description')
    .setVersion('1.0')
    .addBearerAuth({ type: 'apiKey', name: 'Authorization', in: 'header' })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  //   app.use(
  //     multer({
  //       dest: 'uploads/',
  //     }),
  //   );
  await app.listen(3000);
}
bootstrap();
