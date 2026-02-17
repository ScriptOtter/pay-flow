import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { Request } from 'express';
import { Product } from 'src/infrastructure/mongo/product.schema';
import { Authorized } from 'src/shared/decorators';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  @HttpCode(201)
  @ApiOperation({ summary: 'Создать продукт' })
  @ApiResponse({
    status: 201,
    description: 'Продукт успешно создан.',
  })
  @ApiResponse({
    status: 403,
    description: 'Не удалось создать продукт.',
  })
  @ApiBody({
    description: 'Данные для входа в аккаунт',
    type: CreateProductDto,
    examples: {
      example: {
        value: {
          name: 'Хлеб',
          description: 'Свежий хлеб',
          price: 100,
          quantity: 100,
        },
      },
    },
  })
  @ApiBearerAuth()
  public async create(
    @Authorized('_id') id: string,
    @Body() dto: CreateProductDto,
  ) {
    this.productService.create(id, dto);
  }

  @Get('all')
  @HttpCode(200)
  @ApiOperation({ summary: 'Получить все продукты' })
  @ApiResponse({
    status: 200,
    description: 'Продукты успешно получены.',
  })
  @ApiResponse({
    status: 403,
    description: 'Не удалось получить продукты.',
  })
  public async getAll() {
    return this.productService.getAll();
  }

  @Get('')
  @HttpCode(200)
  @ApiOperation({ summary: 'Получить все продукты у пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Продукты успешно получены.',
  })
  @ApiResponse({
    status: 403,
    description: 'Не удалось получить продукты.',
  })
  @ApiQuery({
    name: 'id',
    description: 'Идентификатор пользователя',
  })
  public async getUserProducts(@Query('id') id: string) {
    return this.productService.getByOwnerId(id);
  }

  @Get('delete')
  @HttpCode(200)
  @ApiOperation({ summary: 'Удалить продукт' })
  @ApiResponse({
    status: 200,
    description: 'Продукт успешно удален.',
  })
  @ApiResponse({
    status: 403,
    description: 'Не удалось удалить продукт.',
  })
  public async delete(id: string) {
    return this.productService.delete(id);
  }
}
