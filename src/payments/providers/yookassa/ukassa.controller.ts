import { Controller, Get, Req, Res } from '@nestjs/common';
import { UkassaService } from './ukassa.service';

@Controller('yookassa')
export class UkassaController {
  constructor(private readonly ukassaService: UkassaService) {}

  @Get('test-payment')
  public async createPayment() {
    return this.ukassaService.createPayment({
      amount: 100,
      description: 'Test payment',
      metadata: {
        user_id: '123456',
        product_id: '789012',
        price: '100.00',
      },
    });
  }
}
