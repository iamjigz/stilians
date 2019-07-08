import { Item } from './../models/item';

export interface InventoryPage {
  loading: boolean;
  items: Item[];
  formStatus: string;
}
