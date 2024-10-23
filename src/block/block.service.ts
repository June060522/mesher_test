import { Injectable, NotFoundException } from "@nestjs/common";
import { ethers } from "ethers";
import { DatabaseService } from "./database/database.service";

@Injectable()
export class BlockService {
    private provider: ethers.InfuraProvider;
    constructor(private dataService: DatabaseService) {
        this.provider = new ethers.InfuraProvider("mainnet", process.env.API_KEY);
    }

    async getBlockByHash(blockHash: string): Promise<any> { // 오류시 string 성공시 배열 리턴
        try {
            //const block = await this.provider.getBlock(blockHash); // hash로 블록 조회
            const block = await this.dataService.GetBlock(blockHash); // hash로 블록 조회
            if (!block) {
                return 'Failed find Block'; // 블록 조회에 실패 했을때
            }

            //병렬작업
            const transaction = await Promise.all(
                block.transactions.map(async (hash) => {
                    const receipt = await this.provider.getTransactionReceipt(hash);
                    return {
                        receipts: receipt,
                        logs: receipt.logs, // 로그도 추가
                    };
                })
            );

            //배열로 반환
            return {
                block: {
                    hash: block.hash,
                    number: block.number,
                    time: block.timestamp,
                },
                transaction
            }

        } catch (error) { //오류 예외처리
            throw new NotFoundException(error);
        }
    }

    async getBlock(blockNumber: string): Promise<any> { // 넘버를 기준으로 해쉬 겟
        try {
            //const block = await this.provider.getBlock(+blockNumber);
            const block = await this.dataService.GetBlock(blockNumber);
            return block; // 블록이 널이면 ''리턴
        }
        catch (error) {
            throw new NotFoundException(error);
        }
    }

    async getBlockByNumber(blockNumber: string): Promise<any> { // 블록 넘버를 기준으로 블록 반환
        try {
            const block = await this.getBlock(blockNumber); //블록 해쉬값 겟
            if (!block) {
                return 'Failed find block';
            }
            return block;
        } catch (error) {
            throw new NotFoundException(error);
        }
    }

    async getBlockLatest(): Promise<any> { // 마지막 블록 가져오기 (테스트용)
        const blocks = await this.provider.getBlock('latest');
        return await blocks;
    }
}