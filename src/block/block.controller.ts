import { Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { BlockService } from "./block.service";

@Controller('block')
export class BlockController {
    constructor(
        private readonly blockService: BlockService,
    ) { }

    @Get('latest')
    getBlockLatest(): Promise<any> {
        return this.blockService.getBlockLatest();
    }

    @Get('hash/:hash')
    getBlockByHash(@Param('hash') blockHash: string): Promise<any> {
        return this.blockService.getBlockByHash(blockHash);
    }

    @Get('number/:number')
    getBlockByNumber(@Param('number') blockNumber: string): Promise<any> {
        return this.blockService.getBlockByNumber(blockNumber);
    }
}