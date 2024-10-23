import { Module } from "@nestjs/common";
import { SlackService } from "./slack.service";
import { DatabaseService } from "src/block/database/database.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Block } from "src/block/entities/block.entity";
import { SlackController } from "./slack.controller";

@Module({
    imports: [TypeOrmModule.forFeature([Block])],
    controllers: [SlackController],
    providers: [SlackService, DatabaseService],
})
export class SlackModule{}