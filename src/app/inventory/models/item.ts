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
}

export interface Stock {
  name: string;
  total: number;
  items?: Item[];
}
