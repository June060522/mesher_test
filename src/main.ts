import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './slack/HttpExeception';
import { SlackService } from './slack/slack.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder() // swagger 연결
    .setTitle("example")
    .setDescription("API Description")
    .setVersion('1.0')
    .build()
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, documentFactory);

  const slackService = app.get(SlackService); // slackService를 불러와
  app.useGlobalFilters(new HttpExceptionFilter(slackService)); // 오류 발생시 슬랙봇에 메시지 전달

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
