import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from 'src/infrastructure/mongo/product.schema';

@Injectable()
export class ProductService {
  public constructor(
    @InjectModel('Product') private readonly productModel: Model<Product>,
  ) {}
}
