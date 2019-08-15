import { Stock } from '../models/item';

export interface StockState {
  loading: boolean;
  stocks: Stock[];
  formStatus: string;
}
