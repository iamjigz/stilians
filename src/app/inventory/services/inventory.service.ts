import { InventoryPageStore } from './inventory-page.store';
import { InventoryFirestore } from './inventory.firestore';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Item } from '../models/item';
import { tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  constructor(
    private firestore: InventoryFirestore,
    private store: InventoryPageStore
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

  create(item: Item) {
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
