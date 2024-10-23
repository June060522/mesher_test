import { Module } from "@nestjs/common";
import { TransactionController } from "./transaction.controller";
import { TransactionService } from "./transaction.service";
import { DatabaseService } from "src/block/database/database.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Block } from "src/block/entities/block.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Block])],// 데이터 베이스 접근하기 위해 필요함
    controllers: [TransactionController],
    providers: [TransactionService, DatabaseService]
})
export class TransactionModule { }