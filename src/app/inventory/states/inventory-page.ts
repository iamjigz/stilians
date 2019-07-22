import { Item, Stock } from './../models/item';

export interface InventoryPage {
  loading: boolean;
  items: Item[];
  formStatus: string;
  stock: Stock[];
}
