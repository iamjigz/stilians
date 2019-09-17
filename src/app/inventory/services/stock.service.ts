import { StockStore } from './stock.store';
import { StockFirestore } from './stock.firestore';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap, map, filter } from 'rxjs/operators';

import { Stock, Item } from '../models/item';
import { Order } from 'src/app/transactions/models/transaction';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  constructor(private firestore: StockFirestore, private store: StockStore) {
    this.firestore
      .collection$()
      .pipe(
        tap(stocks => {
          this.store.patch(
            {
              loading: false,
              stocks
            },
            `[STOCK] collection subscription`
          );
        })
      )
      .subscribe();
  }

  get stock$(): Observable<Stock[]> {
    return this.store.state$.pipe(map(state => state.stocks));
  }

  get loading$(): Observable<boolean> {
    return this.store.state$.pipe(map(state => state.loading));
  }

  get noResults$(): Observable<boolean> {
    return this.store.state$.pipe(
      map(state => {
        return !state.loading && state.stocks && state.stocks.length === 0;
      })
    );
  }

  private create(stock: Stock) {
    this.store.patch(
      {
        loading: true,
        stocks: []
      },
      '[INVENTORY] create'
    );
    return this.firestore
      .create(stock)
      .then(_ => {
        this.store.patch(
          {
            formStatus: 'Stock Updated!'
          },
          '[STOCK] create SUCCESS'
        );
        setTimeout(
          () =>
            this.store.patch(
              {
                formStatus: ''
              },
              '[STOCK] create timeout reset formStatus'
            ),
          2000
        );
      })
      .catch(err => {
        this.store.patch(
          {
            loading: false,
            formStatus: 'An error ocurred'
          },
          '[STOCK] create ERROR'
        );
      });
  }

  private async findStock(item: Item | Order) {
    let result = [];

    const filtered = this.firestore
      .collection$()
      .pipe(
        tap(stocks => {
          console.log(stocks);
          result = [...stocks];
        })
      )
      .subscribe();

    console.log(result);
    return result;
  }

  async deduct(item: Item | Order) {
    this.store.patch(
      {
        loading: true,
        stocks: []
      },
      '[STOCK] deduct'
    );

    const filtered = this.findStock(item);

    console.log(filtered);

    // if (stock.length > 0) {
    //   this.firestore.update(stock[0].ref, {
    //     name: stock[0].name,
    //     price: stock[0].price,
    //     total: stock[0].total - item.quantity
    //   });
    // }
  }
}
