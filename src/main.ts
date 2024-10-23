import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './slack/HttpExeception';
import { SlackService } from './slack/slack.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle("example")
    .setDescription("API Description")
    .setVersion('1.0')
    .build()
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, documentFactory);

  const slackService = app.get(SlackService);
  app.useGlobalFilters(new HttpExceptionFilter(slackService));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
