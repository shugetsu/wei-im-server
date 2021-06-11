import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerConfig } from './config/swagger.config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as chalk from 'chalk';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useWebSocketAdapter(new IoAdapter(app));

  // Swagger
  if (SwaggerConfig.enable) {
    const config = new DocumentBuilder()
      .setTitle(SwaggerConfig.title)
      .setDescription(SwaggerConfig.desc)
      .setVersion(SwaggerConfig.version)
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(SwaggerConfig.setupPath, app, document);
  }

  const port = 3000;
  await app.listen(port, () => {
    if (SwaggerConfig.enable) {
      const host = 'http://localhost';
      const docs = SwaggerConfig.setupPath;
      console.log(
        '\n',
        chalk.blue.bold('接口文档:'.padStart(16)),
        chalk.green.underline(`${host}:${port}/${docs}`),
      );
    }
  });
}
bootstrap();
