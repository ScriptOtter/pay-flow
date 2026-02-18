import { Module } from '@nestjs/common';

import { UkassaModule } from './providers/yookassa/ukassa.module';
import { UkassaService } from './providers/yookassa/ukassa.service';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { WebhookModule } from './webhooks/webhook.module';
import { ProductModule } from 'src/modules/product/product.module';
import { PurchaseModule } from 'src/modules/purchase/purchase.module';

@Module({
  imports: [UkassaModule, WebhookModule, ProductModule, PurchaseModule],
  controllers: [PaymentController],
  providers: [UkassaService, PaymentService],
})
export class PaymentModule {}
