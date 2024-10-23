import { Injectable } from "@nestjs/common";
import { ethers } from "ethers";
import { DatabaseService } from "src/block/database/database.service";

const provider = new ethers.InfuraProvider("mainnet", process.env.API_KEY);

@Injectable()
export class TransactionService {
    private provider: ethers.InfuraProvider;

    constructor(private dataService: DatabaseService) { // 데이타 서비스 들고오기
        this.provider = new ethers.InfuraProvider("mainnet", process.env.API_KEY);
    }

    async getReceiptByHash(hash: string): Promise<any> { // hash : transaction ahsh
        const receipt = await provider.getTransactionReceipt(hash); // 해쉬를 기준으로 레시피 탐색
        //const receipt = this.dataService.GetTransaction(hash);

        if (!receipt) {
            return 'Failed find receipt';
        }
        return await this.getLogs(receipt);
    }

    async getReceiptByFrom(from: string): Promise<any> {
        const receipts = await this.dataService.getDataFromDic(from);
        return await this.getLogs(receipts);
    }

    async getReceiptByTo(to: string): Promise<any> {
        const receipts = await this.dataService.getDataToDic(to);
        return await this.getLogs(receipts);
    }

    async getLogs(receipt: any): Promise<any> {
        const logs = []; // 로그 기록
        for (const log of receipt) {
            logs.push(log);
        }
        return {
            receipt: {
                hash: receipt.blockHash,
                number: receipt.blockNumber,
                to: receipt.to,
                from: receipt.from
            },
            logs
        };
    }
}