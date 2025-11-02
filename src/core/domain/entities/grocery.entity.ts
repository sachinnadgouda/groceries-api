export class GroceryEntity {
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
}