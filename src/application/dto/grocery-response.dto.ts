export interface IGroceryEntity {
  id: number;
  name: string;
  color: string;
  price: number;
  quantity: number;
}

export class GroceryResponseDto {
  id: number;
  name: string;
  color: string;
  price: number;
  quantity: number;

  constructor(
    id: number,
    name: string,
    color: string,
    price: number,
    quantity: number,
  ) {
    this.id = id;
    this.name = name;
    this.color = color;
    this.price = price;
    this.quantity = quantity;
  }

  static fromEntity(entity: IGroceryEntity): GroceryResponseDto {
    return new GroceryResponseDto(
      entity.id,
      entity.name,
      entity.color,
      entity.price,
      entity.quantity,
    );
  }
}