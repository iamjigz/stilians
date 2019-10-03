export interface Order {
  name: string;
  quantity: number;
  price: number;
}

export interface Transaction {
  ref?: string;
  orders: Order[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  timestamp?: Date | string;
}
