import { Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { DatabaseService } from "./database.service";
import { Block } from "../entities/block.entity";

@Controller('db')
export class DatabaseController {
    constructor(
        private readonly databaseService: DatabaseService,
    ) { }

    getDataFromDic(from: string): Promise<any> {
        return this.databaseService.getDataFromDic(from);
    }

    getDataToDic(to: string): Promise<any> {
        return this.databaseService.getDataToDic(to);
    }

    @Get('block/:registTest')
    regist(@Param('hash') hash: string): void {
        this.databaseService.regist(hash);
    }

    @Get('block/:findTest')
    findBlock(@Param('hash') hash: string): Promise<Block> {
        return this.databaseService.findBlock(hash);
    }
}