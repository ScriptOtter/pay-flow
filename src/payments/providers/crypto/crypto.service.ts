import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { CreatePaymentDto } from 'src/payments/dto/payment.dto';
import {
  CreateInvoicePayload,
  CryptoResponse,
  CurrencyType,
  FiatCurrency,
  InvoiceResponse,
  PaidButtonName,
} from 'src/payments/interfaces/common.interface';

@Injectable()
export class CryptoService {
  private readonly TOKEN: string;
  private readonly crypto_pay_url: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.TOKEN = configService.getOrThrow<string>('CRYPTO_PAY_TOKEN');
    this.crypto_pay_url = 'https://testnet-pay.crypt.bot/api';
  }

  private async getRequest<T>(
    method: 'GET' | 'POST',
    endpoint: string,
    data?: any,
  ) {
    const observable = firstValueFrom(
      this.httpService.request<CryptoResponse<T>>({
        baseURL: `${this.crypto_pay_url + endpoint}`,
        method,
        headers: {
          'Crypto-Pay-API-Token': this.TOKEN,
        },
        data,
      }),
    );
    const { data: response } = await observable;
    return response;
  }

  public async getMe() {
    const response = await this.getRequest('GET', '/getMe');
    console.log(response);
    return response;
  }

  public async createInvoice(data: CreatePaymentDto) {
    const payload: CreateInvoicePayload = {
      amount: String(data.amount),
      currency_type: CurrencyType.Fiat,
      description: data.description,
      fiat: FiatCurrency.RUB,
      hidden_message: `Оплата продукта ${data.description} с ID: ${data.metadata.product_id} прошла успешно`,
      paid_btn_name: PaidButtonName.Callback,
      paid_btn_url: `${this.configService.getOrThrow<string>('SERVER_URL')}`,
    };
    const response = await this.getRequest('POST', '/createInvoice', payload);
    return response;
  }
}
