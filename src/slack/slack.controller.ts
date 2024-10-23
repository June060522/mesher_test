import { Controller } from "@nestjs/common";
import { SlackService } from "./slack.service";

@Controller('Slack')
export class SlackController{
    constructor(
        private readonly slackService: SlackService,
    ) { }
}