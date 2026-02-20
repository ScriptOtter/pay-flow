import { Body, Injectable, UnauthorizedException } from '@nestjs/common';
import { NotificationEventEnum, YookassaNotification } from 'nestjs-yookassa';
import { UkassaService } from '../providers/yookassa/ukassa.service';
import CIDR from 'ip-cidr';
@Injectable()
export class WebhookService {
  constructor(private readonly ukassaService: UkassaService) {}

  public yookassaNotification(ip: string, event: YookassaNotification) {
    this.verifyNotification(ip);
    switch (event.event) {
      case NotificationEventEnum.PAYMENT_WAITING_FOR_CAPTURE:
        console.log('Payment waiting for capture:', event.object.id);
        return this.ukassaService.waiting_for_capture(event);

      case NotificationEventEnum.PAYMENT_SUCCEEDED:
        console.log('Payment succeeded:', event.object.id);
        return this.ukassaService.successed(event);
      default:
    }
  }

  private verifyNotification(ip: string) {
    const allowed_ips = [
      '185.71.76.0/27',
      '185.71.77.0/27',
      '77.75.153.0/25',
      '77.75.156.11',
      '77.75.156.35',
      '77.75.154.128/25',
      '2a02:5180::/32',
    ];
    for (const range of allowed_ips)
      if (range.includes('/')) {
        const cidr = new CIDR(range);

        if (cidr.contains(ip)) return;
      } else if (ip === range) return;
    throw new UnauthorizedException(`Invalid IP: ${ip}`);
  }
}
