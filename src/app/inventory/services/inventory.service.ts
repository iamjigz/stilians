import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';

import { InventoryPageStore } from './inventory-page.store';
import { InventoryFirestore } from './inventory.firestore';
import { AngularFirestore } from '@angular/fire/firestore';

import { Item, Stock } from '../models/item';
import { query } from '@angular/animations';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  constructor(
    private firestore: InventoryFirestore,
    private store: InventoryPageStore,
    private afs: AngularFirestore
  ) {
    this.firestore
      .collection$()
      .pipe(
        tap(items => {
          this.store.patch(
            {
              loading: false,
              items
            },
            `[INVENTORY] collection subscription`
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

  get items$(): Observable<Item[]> {
    return this.store.state$.pipe(
      map(state => (state.loading ? [] : state.items))
    );
  }

  get loading$(): Observable<boolean> {
    return this.store.state$.pipe(map(state => state.loading));
  }

  get noResults$(): Observable<boolean> {
    return this.store.state$.pipe(
      map(state => {
        return !state.loading && state.items && state.items.length === 0;
      })
    );
  }

  get formStatus$(): Observable<string> {
    return this.store.state$.pipe(map(state => state.formStatus));
  }

  add(item: Item): Stock[] {
    console.log(item.name);
    let stock = [];
    const stockQuery = this.afs
      .collection<Stock>('stock', ref => ref.where('name', '==', item.name))
      .get()
      .subscribe(res => (stock = res.docs));

    console.log(stock);
    // stockQuery.unsubscribe();
    return stock;
  }

  create(item: Item) {
    // this.add(item);

    this.store.patch(
      {
        loading: true,
        items: [],
        formStatus: 'Saving...'
      },
      '[INVENTORY] create'
    );

    return this.firestore
      .create(item)
      .then(_ => {
        this.store.patch(
          {
            formStatus: 'Saved!'
          },
          '[INVENTORY] create SUCCESS'
        );
        setTimeout(
          () =>
            this.store.patch(
              {
                formStatus: ''
              },
              '[INVENTORY] create timeout reset formStatus'
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
          '[INVENTORY] create ERROR'
        );
      });
  }

  delete(id: string): any {
    this.store.patch({ loading: true, items: [] }, '[INVENTORY] delete');
    return this.firestore.delete(id).catch(err => {
      this.store.patch(
        {
          loading: false,
          formStatus: 'An error ocurred'
        },
        '[INVENTORY] delete ERROR'
      );
    });
  }
}
