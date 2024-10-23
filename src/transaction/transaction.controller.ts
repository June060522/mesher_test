import { Controller, Get, Param } from "@nestjs/common";
import { TransactionService } from "./transaction.service";

@Controller('transaction')
export class TransactionController {
    constructor(
        private readonly transactionService: TransactionService
    ) { }

    @Get('hash/:hash')
    getTransactionByHash(@Param('hash') receiptHash: string): Promise<any> {
        return this.transactionService.getReceiptByHash(receiptHash);
    }

    @Get('from/:from')
    getTrasactionByFrom(@Param('from') from: string): Promise<any> {
        return this.transactionService.getReceiptByTo(from);
    }

    @Get('to/:to')
    getTrasactionByTo(@Param('to') to: string): Promise<any> {
        return this.transactionService.getReceiptByTo(to);
    }
}