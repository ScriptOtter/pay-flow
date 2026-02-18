import { Module } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PurchaseSchema } from 'src/infrastructure/mongo/purchase.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Purchase', schema: PurchaseSchema }]),
  ],
  providers: [PurchaseService],
  exports: [PurchaseService],
})
export class PurchaseModule {}
