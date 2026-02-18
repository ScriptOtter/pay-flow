import { Controller, Post, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { YookassaWebhook, YookassaNotification } from 'nestjs-yookassa';
import { WebhookService } from './webhook.service';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}
  @HttpCode(HttpStatus.OK)
  @Post('yookassa')
  @YookassaWebhook()
  public yookassaNotification(@Body() event: YookassaNotification) {
    return this.webhookService.yookassaNotification(event);
  }
}
