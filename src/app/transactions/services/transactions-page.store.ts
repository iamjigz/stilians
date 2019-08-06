import { TransactionsPage } from '../states/transactions-page';
import { StoreService } from 'src/app/core/services/store.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TransactionsPageStore extends StoreService<TransactionsPage> {
  protected store = 'transactions-page';

  constructor() {
    super({
      loading: true,
      transactions: []
    });
  }
}
