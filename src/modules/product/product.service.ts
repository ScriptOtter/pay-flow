import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from 'src/infrastructure/mongo/product.schema';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductService {
  public constructor(
    @InjectModel('Product') private readonly productModel: Model<Product>,
  ) {}

  public async create(id: string, dto: CreateProductDto): Promise<boolean> {
    try {
      const product = {
        ...dto,
        owner_id: id,
      };
      console.log(product);
      const createdProduct = await this.productModel.create(product);

      if (!createdProduct)
        throw new BadRequestException('Не удалось создать продукт');
      return true;
    } catch (e: unknown) {
      if (e instanceof BadRequestException)
        throw new BadRequestException(e.message);
      return false;
    }
  }

  public async getAll(): Promise<Product[] | null> {
    try {
      return await this.productModel.find();
    } catch (e) {
      return null;
    }
  }

  public async getByOwnerId(owner_id: string): Promise<Product[] | null> {
    try {
      return await this.productModel.find({ owner_id });
    } catch (e) {
      return null;
    }
  }

  public async delete(id: string): Promise<boolean> {
    try {
      const deletedProduct = await this.productModel.deleteOne({ _id: id });
      if (!deletedProduct.deletedCount)
        throw new BadRequestException('Не удалось удалить продукт');
      return true;
    } catch (e: unknown) {
      if (e instanceof BadRequestException)
        throw new BadRequestException(e.message);
      return false;
    }
  }
}
