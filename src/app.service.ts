import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { SlackService } from './slack/slack.service';
import axios from 'axios';

@Injectable()
export class AppService {
    constructor(private readonly slackService: SlackService) { }

    // 5분마다 실행
    @Cron('*/5 * * * *')
    async handleCron() {
        await this.slackService.sendDatabaseDataMessage();
    }

    //1시간 마다 실행
    @Cron('0 * * * *')
    async handleCron2() {
        await this.slackService.sendServerStateMessage();
    }
}
