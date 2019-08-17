export interface Item {
  ref?: string;
  id: string;
  name: string;
  genericName: string;
  expiryDate: any;
  quantity: number;
  supplier: string;
  purchaseDate: any;
  purchasePrice: number;
  retailPrice: number;
  totalPurchase: number;
}

export interface Stock {
  name: string;
  price: number;
  total: number;
  items?: Item[];
}

export interface Stock {
  ref?: string;
  name: string;
  total: number;
  items?: Item[];
}
