export interface Transaction extends Order {
  transid: string;
  orders: Order[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
}

export interface Order {
  name: string;
  quantity: number;
  price: number;
}
