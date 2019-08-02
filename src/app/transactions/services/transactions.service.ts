import { TransactionsPageStore } from './transactions-page.store';
import { TransactionFirestore } from './transactions.firestore';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Transaction, Order } from '../models/transaction';
import { tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {
  constructor(
    private firestore: TransactionFirestore,
    private store: TransactionsPageStore
  ) {
    this.firestore
      .collection$()
      .pipe(
        tap(transactions => {
          this.store.patch(
            {
              loading: false,
              transactions
            },
            `[transactions] collection subscription`
          );
        })
      )
      .subscribe();
  }

  get transactions$(): Observable<Transaction[]> {
    return this.store.state$.pipe(
      map(state => (state.loading ? [] : state.transactions))
    );
  }

  get loading$(): Observable<boolean> {
    return this.store.state$.pipe(map(state => state.loading));
  }

  get noResults$(): Observable<boolean> {
    return this.store.state$.pipe(
      map(state => {
        return (
          !state.loading &&
          state.transactions &&
          state.transactions.length === 0
        );
      })
    );
  }

  get formStatus$(): Observable<string> {
    return this.store.state$.pipe(map(state => state.formStatus));
  }

  create(transaction: Transaction) {
    this.store.patch(
      {
        loading: true,
        transactions: [],
        formStatus: 'Saving...'
      },
      '[transactions] create'
    );
    return this.firestore
      .create(transaction)
      .then(_ => {
        this.store.patch(
          {
            formStatus: 'Saved!'
          },
          '[transactions] create SUCCESS'
        );
        setTimeout(
          () =>
            this.store.patch(
              {
                formStatus: ''
              },
              '[transactions] create timeout reset formStatus'
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
          '[transactions] create ERROR'
        );
      });
  }

  delete(id: string): any {
    this.store.patch(
      { loading: true, transactions: [] },
      '[transactions] delete'
    );
    return this.firestore.delete(id).catch(err => {
      this.store.patch(
        {
          loading: false,
          formStatus: 'An error ocurred'
        },
        '[transactions] delete ERROR'
      );
    });
  }
}
