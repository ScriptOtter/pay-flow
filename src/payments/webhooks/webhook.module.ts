import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { UkassaModule } from '../providers/yookassa/ukassa.module';

@Module({
  imports: [UkassaModule],
  controllers: [WebhookController],
  providers: [WebhookService],
})
export class WebhookModule {}
