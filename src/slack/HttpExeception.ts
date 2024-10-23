import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { SlackService } from './slack.service';


@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    constructor(private readonly slackService: SlackService) {}

    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception.getStatus();

        const errorMessage = {
            timestamp: new Date().toISOString(),
            path: request.url,
            statusCode: status,
            message: exception.message,
        };

        // 에러 로그 출력
        console.error(errorMessage);

        // 슬랙으로 에러 메시지 전송
        this.slackService.sendMessage('C07TGN5K36V', JSON.stringify(errorMessage));
        
        response.status(status).json(errorMessage);
    }
}
