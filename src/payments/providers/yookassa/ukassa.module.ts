import { Module } from '@nestjs/common';
import { UkassaService } from './ukassa.service';
import { UkassaController } from './ukassa.controller';
import { YookassaModule } from 'nestjs-yookassa';
import { getYookassaConfig } from 'src/config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PurchaseModule } from 'src/modules/purchase/purchase.module';
import { PurchaseService } from 'src/modules/purchase/purchase.service';
@Module({
  imports: [
    YookassaModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getYookassaConfig,
      inject: [ConfigService],
    }),
    PurchaseModule,
  ],
  controllers: [UkassaController],
  providers: [UkassaService],
  exports: [UkassaService],
})
export class UkassaModule {}
