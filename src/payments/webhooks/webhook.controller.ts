import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  Ip,
} from '@nestjs/common';
import { YookassaWebhook, YookassaNotification } from 'nestjs-yookassa';
import { WebhookService } from './webhook.service';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}
  @HttpCode(HttpStatus.OK)
  @Post('yookassa')
  @YookassaWebhook()
  public yookassaNotification(
    @Ip() ip: string,
    @Body() event: YookassaNotification,
  ) {
    return this.webhookService.yookassaNotification(ip, event);
  }
}
