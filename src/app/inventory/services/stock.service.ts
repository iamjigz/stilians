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

  // private checkStock(items: Item[]) {
  //   const key = {};
  //   return items.reduce((arr, item) => {
  //     if (key.hasOwnProperty(item.name)) {
  //       arr[key[item.name]].total += Number(item.quantity);
  //     } else {
  //       key[item.name] = arr.length;
  //       arr.push({
  //         name: item.name,
  //         price: item.retailPrice,
  //         total: Number(item.quantity)
  //       });
  //     }

  //     return arr;
  //   }, []);
  // }

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
    console.log(stock);

    if (stock.length === 0) {
      this.create({
        name: item.name,
        total: item.quantity,
        price: item.retailPrice
      });
    } else {
      console.log('Stock found');
      this.firestore.update(stock[0].ref, {
        name: stock[0].name,
        price: stock[0].price,
        total: stock[0].total + item.quantity
      });
    }
    // stock.subscribe((data: Stock[]) => {
    //   console.log('No stock found');
    //   if (data.length === 0) {
    //     this.create({
    //       name: item.name,
    //       total: item.quantity,
    //       price: item.retailPrice
    //     });
    //   } else {
    //     console.log('Stock found');
    //     this.firestore.update(data[0].ref, {
    //       name: data[0].name,
    //       price: data[0].price,
    //       total: data[0].total + item.quantity
    //     });
    //   }
    // });
  }
}