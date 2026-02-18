import { ConfigService } from '@nestjs/config';
import { YookassaModuleOptions } from 'nestjs-yookassa';

export function getYookassaConfig(
  configService: ConfigService,
): YookassaModuleOptions {
  return {
    apiKey: configService.getOrThrow<string>('YOOKASSA_API_KEY'),
    shopId: configService.getOrThrow<string>('YOOKASSA_SHOP_ID'),
  };
}
