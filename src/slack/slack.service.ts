import { Injectable } from "@nestjs/common";
import { WebClient } from "@slack/web-api";
import axios from "axios";
import { DatabaseService } from "src/block/database/database.service";

@Injectable()
export class SlackService {
    private slackClient: WebClient;
    
    constructor(private databaseService: DatabaseService) {
        this.slackClient = new WebClient(process.env.SLACK_BOT_TOKEN);
    }

    async sendMessage(channel: string, text: string) {
        await this.slackClient.chat.postMessage({
            channel,
            text,
        });
    }

    async sendDatabaseDataMessage() {
        console.log('5분마다 실행');
        let blockCount = await this.databaseService.GetDataCount(); // db에서 블록 갯수 접근
        let transactionCount = await this.databaseService.GetTransactionCount(); // db에서 영수증 갯수 접근
        let LogCount = await this.databaseService.GetLogCount();; // db에서 로그 갯수 접근
        await this.sendMessage('C07TGN5K36V', `
        Block Count : ${blockCount}
TransactionReceipt Count : ${transactionCount}
Log Count : ${LogCount}`);
    }

    async sendServerStateMessage() {
        console.log('1시간마다 실행');
        try {
            const response = await axios.get('http://localhost:3000/api');
            if (response.status === 200) {
                await this.sendMessage('C07TGN5K36V', '서버 작동 중');
            } else {
                await this.sendMessage('C07TGN5K36V', '서버 상태 이상: ' + response.data);
            }
        } catch (error) {
            await this.sendMessage('C07TGN5K36V', '서버 오류: ' + error.message);
        }
    }
}