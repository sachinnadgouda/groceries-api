import { Controller, Get, Param, Query } from '@nestjs/common';
import { GroceriesService } from '../../application/services/groceries.service';
import { PaginationResponseDto } from '../../application/dto/pagination-response.dto';

@Controller('groceries')
export class GroceriesController {
  constructor(private readonly groceriesService: GroceriesService) {}

  // TODO: validate DTOs with class-validator in controllers

  @Get()
  getGroceries(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('color') color?: string,
  ): PaginationResponseDto {
    return this.groceriesService.getGroceries(+page, +limit, color);
  }

  @Get('colors')
  getColors() {
    return this.groceriesService.getAvailableColors();
  }

  @Get(':id')
  getGroceryById(@Param('id') id: string) {
    return this.groceriesService.getGroceryById(+id);
  }
}