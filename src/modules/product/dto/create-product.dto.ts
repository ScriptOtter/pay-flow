import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ description: 'Имя товара', example: 'Хлеб' })
  @IsNotEmpty()
  @IsString()
  name: string;
  @ApiProperty({ description: 'Описание товара', example: 'Свежий хлеб' })
  @IsNotEmpty()
  @IsString()
  description: string;
  @ApiProperty({ description: 'Цена товара', example: '100' })
  @IsNotEmpty()
  @IsNumber()
  price: number;
  @ApiProperty({ description: 'Количество товара', example: '100' })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}
