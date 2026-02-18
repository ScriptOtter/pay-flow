import { Body, Injectable } from '@nestjs/common';
import { NotificationEventEnum, YookassaNotification } from 'nestjs-yookassa';
import { UkassaService } from '../providers/yookassa/ukassa.service';

@Injectable()
export class WebhookService {
  constructor(private readonly ukassaService: UkassaService) {}

  public yookassaNotification(event: YookassaNotification) {
    switch (event.event) {
      case NotificationEventEnum.PAYMENT_WAITING_FOR_CAPTURE:
        console.log('Payment waiting for capture:', event.object.id);
        return this.ukassaService.waiting_for_capture(event);

      case NotificationEventEnum.PAYMENT_SUCCEEDED:
        console.log('Payment succeeded:', event.object.id);
        return this.ukassaService.successed(event);

      case NotificationEventEnum.PAYMENT_CANCELED:
        //console.log('Payment canceled:', event.object);
        break;
      case NotificationEventEnum.REFUND_SUCCEEDED:
        //console.log('Payment refunded:', event.object);
        break;
      default:
      //console.log('Unknown event:', event);
    }
  }
}
