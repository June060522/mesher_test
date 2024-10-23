import { Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { DatabaseService } from "./database.service";
import { Block } from "../entities/block.entity";

@Controller('db')
export class DatabaseController {
    constructor(
        private readonly databaseService: DatabaseService,
    ) { }

    getDataFromDic(from: string): Promise<any> { // 트렌젝션에서 호출
        return this.databaseService.getDataFromDic(from);
    }

    getDataToDic(to: string): Promise<any> {// 트렌젝션에서 호출
        return this.databaseService.getDataToDic(to);
    }

    @Get('block/:registTest')
    regist(@Param('hash') hash: string): void { //DB에 등록되는지 테스트하는 코드
        this.databaseService.regist(hash);
    }

    @Get('block/:findTest')
    findBlock(@Param('hash') hash: string): Promise<Block> {// DB에서 찾아지는지 테스트하는 코드
        return this.databaseService.findBlock(hash);
    }
}