import { Injectable } from '@nestjs/common';
import { IGroceriesRepository } from '../../core/interfaces/groceries.repository';
import { GroceryEntity } from '../../core/domain/entities/grocery.entity';

@Injectable()
export class GroceriesRepositoryImpl implements IGroceriesRepository {
  private groceries: GroceryEntity[] = [
    new GroceryEntity(1, 'Apple', 'Red', 1.5, 10),
    new GroceryEntity(2, 'Banana', 'Yellow', 0.8, 15),
    new GroceryEntity(3, 'Carrot', 'Orange', 0.6, 20),
    new GroceryEntity(4, 'Tomato', 'Red', 1.2, 8),
    new GroceryEntity(5, 'Blueberry', 'Blue', 3.0, 5),
    new GroceryEntity(6, 'Grape', 'Green', 2.5, 12),
    new GroceryEntity(7, 'Strawberry', 'Red', 2.0, 7),
    new GroceryEntity(8, 'Lemon', 'Yellow', 0.9, 18),
  ];

  findAll(
    page: number,
    limit: number,
    color?: string,
  ): { data: GroceryEntity[]; total: number } {
    let filtered = this.groceries;

    if (color) {
      filtered = filtered.filter(
        (g) => g.color.toLowerCase() === color.toLowerCase(),
      );
    }

    //TODO: validate pagination params in controller
    const total = filtered.length;
    const start = (page - 1) * limit;
    const data = filtered.slice(start, start + limit);

    return { data, total };
  }

  findById(id: number): GroceryEntity | null {
    return this.groceries.find((g) => g.id === id) || null;
  }

  getAvailableColors(): string[] {
    const colors = new Set(this.groceries.map((g) => g.color));
    return Array.from(colors);
  }
}