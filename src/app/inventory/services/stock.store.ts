import { StockState } from '../states/stock.state';
import { StoreService } from 'src/app/core/services/store.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StockStore extends StoreService<StockState> {
  protected store = 'stock';

  constructor() {
    super({
      loading: true,
      stocks: []
    });
  }
}
