import { Transaction } from '../models/transaction';

export interface TransactionsPage {
  loading: boolean;
  transactions: Transaction[];
  formStatus: string;
}
