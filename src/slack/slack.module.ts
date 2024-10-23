import { Module } from "@nestjs/common";
import { SlackService } from "./slack.service";
import { DatabaseService } from "src/block/database/database.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Block } from "src/block/entities/block.entity";
import { SlackController } from "./slack.controller";

@Module({
    imports: [TypeOrmModule.forFeature([Block])],// 데이터 베이스 접근하기 위해 필요함
    controllers: [SlackController],
    providers: [SlackService, DatabaseService],
})
export class SlackModule{}