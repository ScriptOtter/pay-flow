import { Module } from '@nestjs/common';
import { UkassaService } from './ukassa.service';
import { YookassaModule } from 'nestjs-yookassa';
import { getYookassaConfig } from 'src/config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PurchaseModule } from 'src/modules/purchase/purchase.module';

@Module({
  imports: [
    YookassaModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getYookassaConfig,
      inject: [ConfigService],
    }),
    PurchaseModule,
  ],
  providers: [UkassaService],
  exports: [UkassaService],
})
export class UkassaModule {}
