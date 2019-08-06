import { Injectable } from '@angular/core';
import { FirestoreService } from 'src/app/core/services/firestore.service';
import { Transaction } from '../models/transaction';

@Injectable({
  providedIn: 'root'
})
export class TransactionFirestore extends FirestoreService<Transaction> {
  protected basePath = 'transactions';
}
