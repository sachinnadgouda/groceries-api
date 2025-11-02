import { Injectable, Inject, NotFoundException, Logger } from '@nestjs/common';
import { type IGroceriesRepository } from '../../core/interfaces/groceries.repository';
import { GroceryResponseDto } from '../dto/grocery-response.dto';
import { PaginationResponseDto } from '../dto/pagination-response.dto';
import { GROCERIES_REPOSITORY } from '../../shared/constants/injection-token';

@Injectable()
export class GroceriesService {
  private readonly logger = new Logger(GroceriesService.name);

  constructor(
    @Inject(GROCERIES_REPOSITORY)
    private readonly groceriesRepository: IGroceriesRepository,
  ) {}

  getGroceries(
    page: number,
    limit: number,
    color?: string,
  ): PaginationResponseDto {
    this.logger.debug(
      `Fetching groceries - page: ${page}, limit: ${limit}, color: ${color}`,
    );

    const { data, total } = this.groceriesRepository.findAll(
      page,
      limit,
      color,
    );

    const responseData = data.map((entity) =>
      GroceryResponseDto.fromEntity(entity),
    );

    return new PaginationResponseDto(responseData, total, page, limit);
  }

  getGroceryById(id: number): GroceryResponseDto {
    const entity = this.groceriesRepository.findById(id);

    if (!entity) {
      this.logger.warn(`Grocery not found with id: ${id}`);
      throw new NotFoundException(`Grocery with id ${id} not found`);
    }

    return GroceryResponseDto.fromEntity(entity);
  }

  getAvailableColors(): string[] {
    return this.groceriesRepository.getAvailableColors();
  }
}