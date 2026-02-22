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
import {
  CryptoResponse,
  InvoiceResponse,
} from '../interfaces/common.interface';
import { CreatePaymentDto } from '../dto/payment.dto';

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

  public cryptoHandler(
    @Body() body: CryptoResponse<InvoiceResponse>,
    @Headers('crypto-pay-api-signature') sig: string,
  ) {
    this.crypto.cryptoHandler(body, sig);
  }
}
