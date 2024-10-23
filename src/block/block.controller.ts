import { Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { BlockService } from "./block.service";

@Controller('block')
export class BlockController {
    constructor(
        private readonly blockService: BlockService,
    ) { }

    @Get('latest')
    getBlockLatest(): Promise<any> { // 마지막 블록 겟
        return this.blockService.getBlockLatest();
    }

    @Get('hash/:hash')
    getBlockByHash(@Param('hash') blockHash: string): Promise<any> { // 해쉬를 기준으로 블록접근
        return this.blockService.getBlockByHash(blockHash);
    }

    @Get('number/:number')
    getBlockByNumber(@Param('number') blockNumber: string): Promise<any> { // 블록 넘버를 기준으로 블록 접근
        return this.blockService.getBlockByNumber(blockNumber);
    }
}