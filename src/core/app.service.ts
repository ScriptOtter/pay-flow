import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  public healthStatus(): string {
    return 'Hello World!';
  }
}
