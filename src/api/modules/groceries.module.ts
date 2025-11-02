import { Module } from '@nestjs/common';
import { GroceriesController } from '../controllers/groceries.controller';
import { GroceriesService } from '../../application/services/groceries.service';
import { GroceriesRepositoryImpl } from '../../infrastructure/persistence/groceries.repository.impl';
import { GROCERIES_REPOSITORY } from '../../shared/constants/injection-token';


@Module({
  controllers: [GroceriesController],
  providers: [
    GroceriesService,
    {
      provide: GROCERIES_REPOSITORY,
      useClass: GroceriesRepositoryImpl,
    },
  ],
})
export class GroceriesModule {}