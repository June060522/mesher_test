import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlockModule } from './block/block.module';
import { TransactionModule } from './transaction/transaction.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Block } from './block/entities/block.entity';
import { DatabaseModule } from './block/database/database.module';
import { HttpModule } from "@nestjs/axios";
import { SlackService } from './slack/slack.service';
import { ScheduleModule } from '@nestjs/schedule';
import { SlackModule } from './slack/slack.module';
import { DatabaseService } from './block/database/database.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    HttpModule, // 오류 출력
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({// DB연동
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({ 
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [Block],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    BlockModule,
    TransactionModule,
    DatabaseModule,
    SlackModule,
    TypeOrmModule.forFeature([Block]),
  ],
  controllers: [AppController],
  providers: [DatabaseService, SlackService, AppService],
})
export class AppModule { }