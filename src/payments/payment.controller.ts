import { Body, Controller, Get, Query, Req, Res } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Authorized, Protected } from 'src/shared/decorators';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Protected()
  @Get('test-payment')
  @ApiBearerAuth()
  public async createPayment(
    @Authorized('_id') user_id: string,
    @Query('product_id') product_id: string,
  ) {
    return this.paymentService.createPayment('yookassa', user_id, product_id);
  }

  @Protected()
  @Get('test-crypto')
  @ApiBearerAuth()
  public async createPaymentCrypto(
    @Authorized('_id') user_id: string,
    @Query('product_id') product_id: string,
  ) {
    return this.paymentService.createPayment('crypto', user_id, product_id);
  }
}
