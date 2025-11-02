import { Module } from '@nestjs/common';
import { GroceriesModule } from './api/modules/groceries.module';

@Module({
  imports: [GroceriesModule],
})
export class AppModule {}
