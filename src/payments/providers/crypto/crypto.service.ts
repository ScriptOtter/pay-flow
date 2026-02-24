import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash, createHmac } from 'crypto';
import { firstValueFrom } from 'rxjs';
import { STATUS_TRANSACTION } from 'src/infrastructure/mongo/purchase.schema';
import { PurchaseService } from 'src/modules/purchase/purchase.service';
import { CreatePaymentDto } from 'src/payments/dto/payment.dto';
import {
  CreateInvoicePayload,
  CryptoResponse,
  CurrencyType,
  FiatCurrency,
  InvoiceResponse,
  PaidButtonName,
} from 'src/payments/interfaces/common.interface';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class CryptoService {
  private readonly TOKEN: string;
  private readonly crypto_pay_url: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly purchaseService: PurchaseService,
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
    const transaction_id = uuidv4();
    const payload: CreateInvoicePayload = {
      amount: String(data.amount),
      currency_type: CurrencyType.Fiat,
      description: data.description,
      fiat: FiatCurrency.RUB,
      hidden_message: `Оплата продукта ${data.description} с ID: ${data.metadata.product_id} прошла успешно`,
      paid_btn_name: PaidButtonName.Callback,
      paid_btn_url: `${this.configService.getOrThrow<string>('SERVER_URL')}`,
      payload: JSON.stringify({ transaction_id }),
    };
    const response: CryptoResponse<InvoiceResponse> = await this.getRequest(
      'POST',
      '/createInvoice',
      payload,
    );
    if (!response)
      throw new BadRequestException('Не удалось создать запрос на оплату');
    const purchase = this.purchaseService.create({
      price: data.amount,
      product_id: data.metadata.product_id,
      status: STATUS_TRANSACTION.WAITING,
      user_id: data.metadata.user_id,
      transaction_id: transaction_id,
    });
    if (!purchase)
      throw new BadRequestException('Не удалось создать запрос на оплату');
    return response;
  }

  public async cryptoHandler(body: InvoiceResponse, sig: string) {
    const secret = createHash('sha256').update(this.TOKEN).digest();
    const checkString = JSON.stringify(body);
    const hmac = createHmac('sha256', secret).update(checkString).digest('hex');
    if (hmac !== sig)
      throw new UnauthorizedException('Crypto token not valid!');
    try {
      const transaction_id = JSON.parse(body.payload.payload).transaction_id;
      const purchased =
        await this.purchaseService.getByTransactionId(transaction_id);
      if (!purchased) {
        throw new Error('purchased not found');
      }
      const changed = await this.purchaseService.changeStatusById(
        transaction_id,
        STATUS_TRANSACTION.SUCCEEDED,
      );
      if (!changed) {
        throw new Error('Failed to update purchase status');
      }
      return true;
    } catch (e) {
      console.log(e);
    }
  }
}
