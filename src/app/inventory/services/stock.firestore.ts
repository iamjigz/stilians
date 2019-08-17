import { Injectable } from '@angular/core';
import { FirestoreService } from 'src/app/core/services/firestore.service';
import { Stock } from './../models/item';

@Injectable({
  providedIn: 'root'
})
export class StockFirestore extends FirestoreService<Stock> {
  protected basePath = 'stock';
}
