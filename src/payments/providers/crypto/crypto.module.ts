import { Module } from '@nestjs/common';
import { CryptoService } from './crypto.service';
import { HttpModule } from '@nestjs/axios';
import { PurchaseModule } from 'src/modules/purchase/purchase.module';

@Module({
  imports: [HttpModule.register({}), PurchaseModule],
  providers: [CryptoService],
  exports: [CryptoService],
})
export class CryptoModule {}
