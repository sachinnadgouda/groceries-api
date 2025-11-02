import { GroceryEntity } from '../domain/entities/grocery.entity';

export interface IGroceriesRepository {
  findAll(
    page: number,
    limit: number,
    color?: string,
  ): { data: GroceryEntity[]; total: number };
  findById(id: number): GroceryEntity | null;
  getAvailableColors(): string[];
}