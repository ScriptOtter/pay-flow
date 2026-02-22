import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { UkassaModule } from '../providers/yookassa/ukassa.module';
import { CryptoModule } from '../providers/crypto/crypto.module';

@Module({
  imports: [UkassaModule, CryptoModule],
  controllers: [WebhookController],
  providers: [WebhookService],
})
export class WebhookModule {}
