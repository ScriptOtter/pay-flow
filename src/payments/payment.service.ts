import { BadRequestException, Injectable } from '@nestjs/common';
import { UkassaService } from './providers/yookassa/ukassa.service';
import { CreatePaymentDto } from './dto/payment.dto';
import { ProductService } from 'src/modules/product/product.service';

@Injectable()
export class PaymentService {
  constructor(
    private readonly yookassaService: UkassaService,
    private readonly productService: ProductService,
  ) {}

  public async createPayment(
    type: 'yookassa' | 'stripe',
    user_id: string,
    product_id: string,
  ) {
    const product = await this.productService.getProductById(product_id);
    if (!product) {
      throw new BadRequestException('Product not found');
    }
    const data: CreatePaymentDto = {
      amount: product.price,
      description: product.description,
      metadata: {
        product_id: product._id,
        user_id,
        price: String(product.price),
      },
    };
    switch (type) {
      case 'yookassa':
        return this.yookassaService.createPayment(data);
      case 'stripe':
        console.log(type);
        break;
    }
  }
}
