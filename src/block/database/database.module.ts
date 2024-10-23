import { Module } from "@nestjs/common";
import { DatabaseController } from "./database.controller";
import { DatabaseService } from "./database.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Block } from "../entities/block.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Block])],
    controllers: [DatabaseController],
    providers: [DatabaseService]
})
export class DatabaseModule { }