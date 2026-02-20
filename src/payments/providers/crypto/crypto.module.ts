import { Module } from '@nestjs/common';
import { CryptoService } from './crypto.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule.register({})],
  providers: [CryptoService],
  exports: [CryptoService],
})
export class CryptoModule {}
