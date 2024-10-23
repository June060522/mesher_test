import { Injectable, NotFoundException } from "@nestjs/common";
import { ethers } from "ethers";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Block } from "../entities/block.entity";

@Injectable()
export class DatabaseService {
    private provider: ethers.InfuraProvider;

    private lastBlockNum: number; //마지막에 들어온 블록 정보 <- 이걸로 비용 최소화
    private dataFromDic: { [key: string]: any[] } = {};
    private dataToDic: { [key: string]: any[] } = {};

    constructor(
        @InjectRepository(Block)
        private blockRepository: Repository<Block>
    ) {
        this.provider = new ethers.InfuraProvider("mainnet", process.env.API_KEY);
    }

    async getDataFromDic(key: string): Promise<any> {
        await this.fetchData();
        return this.dataFromDic[key];
    }

    async getDataToDic(key: string): Promise<any> {
        await this.fetchData();
        console.log(this.dataToDic[key]);
        return this.dataToDic[key];
    }

    async fetchData(): Promise<void> {
        if (this.lastBlockNum == undefined)
            this.lastBlockNum = 21026729; // 가격때문에...테스트용

        if (this.isLastBlockCheck(this.lastBlockNum)) {
            //블록 시작점, 끝점 가져오기
            const startBlock = await this.findBlock(this.lastBlockNum.toString());
            const lastBlock = await this.provider.getBlock('latest');
            let startNumber = startBlock.blockNum;
            let endNumber = lastBlock.number;

            const blockNums = [];
            for (let blockNumber = startNumber; blockNumber <= endNumber; blockNumber++)
                blockNums.push(blockNumber);

            await Promise.all(blockNums.map(async (blockNumber) => {
                console.log(blockNumber);
                //const block = await this.provider.getBlock(blockNumber); //블록 가져오기
                const block = (await this.GetBlock(blockNumber.toString())); //블록 가져오기

                if (!block)
                    throw new Error("Block not Found!");

                const receiptPromise = block.transactions.map(async (transaction) => {
                    //console.log(this.dataFromDic);
                    const receipt = await this.provider.getTransactionReceipt(transaction); // 영수증 가져오기
                    if (receipt) {
                        if (!this.dataFromDic[receipt.from]) { // 배열에 없으면 초기화
                            this.dataFromDic[receipt.from] = [];
                        }
                        this.dataFromDic[receipt.from].push(JSON.stringify(receipt.logs)); // 데이터 푸쉬

                        if (!this.dataToDic[receipt.to]) { // 배열에 없으면 초기화
                            this.dataToDic[receipt.to] = [];
                        }
                        this.dataToDic[receipt.to].push(JSON.stringify(receipt.logs)); // 데이터 푸쉬
                    } else {
                        throw new Error('receipt not Found!');
                    }
                });

                await Promise.all(receiptPromise);
            })
            );

            this.lastBlockNum = endNumber;
        }
    }

    async isLastBlockCheck(lateBlockHash: number): Promise<boolean> {
        const block = await this.provider.getBlock('latest');

        if (!block)
            return false;
        return lateBlockHash === block.number;
    }

    async regist(hash: string) {
        try {
            let getBlock;
            if (hash.startsWith('0x')) { // hash인지 blockNumber인지
                getBlock = await this.provider.getBlock(hash);
            }
            else {
                getBlock = await this.provider.getBlock(+hash);
            }

            if (!getBlock) {
                return 'Failed find Block'; // 블록 조회에 실패 했을때
            }
            const block = new Block();
            block.blockNum = getBlock.number;
            block.hash = getBlock.hash;

            block.block = JSON.stringify(getBlock);

            block.log = [] as string[];

            await Promise.all( // 로그 저장
                getBlock.transactions.map(async (tx) => {
                    const receipt = await this.provider.getTransactionReceipt(tx);
                    block.log.push(JSON.stringify(receipt.logs));
                })
            );
            block.transactionReceipt = JSON.stringify(getBlock.transactions);

            this.blockRepository.save(block); // 저장
        } catch (error) {
            throw new NotFoundException(error);
        }
    }

    async findBlock(hash: string): Promise<Block> {
        let block;
        if (hash.startsWith('0x')) {// 해쉬값인지 블록넘버값인지
            block = await this.blockRepository.findOne({ where: { hash: hash } });
        }
        else {
            block = await this.blockRepository.findOne({ where: { blockNum: +hash } });
        }

        if (!block)// 블록이 없으면 등록하고 다시 겟
        {
            await this.regist(hash);
            return await this.findBlock(hash);
        }
        return block;
    }

    async GetBlock(hash: string): Promise<any> { // DB에서 블록 가져오기
        const block = await this.findBlock(hash);
        return block.block;
    }

    async GetTransaction(hash: string): Promise<any> { // DB에서 트렌젹션레시피 가져오기
        let blockHash = await this.provider.getTransactionReceipt(hash);
        const block = await this.findBlock(blockHash.blockHash);
        return block.transactionReceipt;
    }

    async GetLogs(hash: string): Promise<any> { // DB에서 로그 가져오기
        const block = await this.findBlock(hash);
        let logs = [] as string[];
        block.log.forEach(data => logs.push(JSON.parse(data)));
        return logs;
    }

    async GetDataCount(): Promise<Number> {
        const block = await this.blockRepository.find();
        return block.length;
    }

    async GetTransactionCount(): Promise<Number> {
        const blocks = await this.blockRepository.find();
        let cnt = 0;
        await Promise.all(
            blocks.map(async (block) => {
                if (block.transactionReceipt)
                    cnt += block.transactionReceipt.length;
            })
        );
        return cnt;
    }

    async GetLogCount(): Promise<Number> {
        const blocks = await this.blockRepository.find();
        let cnt = 0;
        await Promise.all(
            blocks.map(async (block) => {
                if (block.log)
                    cnt += block.log.length;
            })
        );
        return cnt;
    }
}