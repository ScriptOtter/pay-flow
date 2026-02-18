import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ConfirmationEnum,
  CurrencyEnum,
  PaymentMethodsEnum,
  PaymentNotificationEvent,
  YookassaNotification,
  YookassaService,
} from 'nestjs-yookassa';
import { CreatePaymentDto, MetadataDto } from '../../dto/payment.dto';
import { PurchaseService } from 'src/modules/purchase/purchase.service';
import { STATUS_TRANSACTION } from 'src/infrastructure/mongo/purchase.schema';

@Injectable()
export class UkassaService {
  public constructor(
    private readonly yookassaService: YookassaService,
    private readonly configService: ConfigService,
    private readonly purchaseService: PurchaseService,
  ) {}
  public async createPayment(data: CreatePaymentDto) {
    const payment = await this.yookassaService.payments.create({
      amount: {
        value: data.amount,
        currency: CurrencyEnum.RUB,
      },
      description: data.description,
      payment_method_data: {
        type: PaymentMethodsEnum.BANK_CARD,
      },
      confirmation: {
        type: ConfirmationEnum.REDIRECT,
        return_url:
          this.configService.getOrThrow<string>('SERVER_URL') + '/api',
      },
      metadata: { ...data.metadata },
      save_payment_method: true,
    });
    return payment;
  }

  public async waiting_for_capture(event: PaymentNotificationEvent) {
    try {
      const data = {
        status: STATUS_TRANSACTION.WAITING,
        transaction_id: event.object.id,
        price: Number(event.object.metadata!.price),
        product_id: event.object.metadata!.product_id,
        user_id: event.object.metadata!.user_id,
      };
      const purchase = await this.purchaseService.create(data);
      if (!purchase) {
        throw new Error('Purchase creation failed');
      }
      this.yookassaService.payments.capture(event.object.id);
      return event;
    } catch (e) {
      console.log(e);
    }
  }

  public async successed(event: PaymentNotificationEvent) {
    try {
      const purchased = await this.purchaseService.getByTransactionId(
        event.object.id,
      );
      if (!purchased) {
        throw new Error('purchased not found');
      }
      const changed = await this.purchaseService.changeStatusById(
        event.object.id,
        STATUS_TRANSACTION.SUCCEEDED,
      );
      if (!changed) {
        throw new Error('Failed to update purchase status');
      }
      return event;
    } catch (e) {
      console.log(e);
    }
  }
}
