import { StockStore } from './stock.store';
import { StockFirestore } from './stock.firestore';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Stock } from '../models/item';
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

  //   private checkStock(stocks: Stock[]) {
  //     const key = {};
  //     return items.reduce((arr, item) => {
  //       if (key.hasOwnProperty(item.name)) {
  //         arr[key[item.name]].total += Number(item.quantity);
  //       } else {
  //         key[item.name] = arr.length;
  //         arr.push({
  //           name: item.name,
  //           price: item.retailPrice,
  //           total: Number(item.quantity)
  //         });
  //       }

  //       return arr;
  //     }, []);
  //   }

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

  create(stock: Stock) {
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

  //   delete(id: string): any {
  //     this.store.patch({ loading: true, items: [] }, '[INVENTORY] delete');
  //     return this.firestore.delete(id).catch(err => {
  //       this.store.patch(
  //         {
  //           loading: false,
  //           formStatus: 'An error ocurred'
  //         },
  //         '[INVENTORY] delete ERROR'
  //       );
  //     });
  //   }

  update(stock: Stock) {}
}
