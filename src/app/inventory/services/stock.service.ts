import { StockStore } from './stock.store';
import { StockFirestore } from './stock.firestore';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Stock, Item } from '../models/item';
import { tap, map } from 'rxjs/operators';

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

  private async findStock(item: Item) {
    let result = [];
    const obs = this.firestore.collection$(ref =>
      ref.where('name', '==', item.name)
    );

    await obs.subscribe(data => (result = data));
    return result;
  }

  async update(item: Item) {
    this.store.patch(
      {
        loading: true,
        stocks: []
      },
      '[STOCK] update'
    );

    const stock = await this.findStock(item);

    if (stock.length === 0) {
      this.create({
        name: item.name,
        total: item.quantity,
        price: item.retailPrice
      });
    } else {
      this.firestore.update(stock[0].ref, {
        name: stock[0].name,
        price: stock[0].price,
        total: stock[0].total + item.quantity
      });
    }
  }
}
