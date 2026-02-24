import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  Ip,
  Headers,
} from '@nestjs/common';
import { YookassaWebhook, YookassaNotification } from 'nestjs-yookassa';
import { WebhookService } from './webhook.service';
import { CryptoService } from '../providers/crypto/crypto.service';
import { InvoiceResponse } from '../interfaces/common.interface';

@Controller('webhook')
export class WebhookController {
  constructor(
    private readonly webhookService: WebhookService,
    private readonly crypto: CryptoService,
  ) {}
  @HttpCode(HttpStatus.OK)
  @Post('yookassa')
  @YookassaWebhook()
  public yookassaNotification(
    @Ip() ip: string,
    @Body() event: YookassaNotification,
  ) {
    return this.webhookService.yookassaNotification(ip, event);
  }
  @HttpCode(HttpStatus.OK)
  @Post('crypto')
  public cryptoHandler(
    @Body() body: InvoiceResponse,
    @Headers('crypto-pay-api-signature') sig: string,
  ) {
    this.crypto.cryptoHandler(body, sig);
  }
}
