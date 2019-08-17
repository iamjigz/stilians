import { Item, Stock } from '../models/item';

export interface InventoryState {
  loading: boolean;
  items: Item[];
  formStatus: string;
}
