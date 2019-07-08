import { Injectable } from '@angular/core';
import { FirestoreService } from 'src/app/core/services/firestore.service';
import { Item } from './../models/item';

@Injectable({
  providedIn: 'root'
})
export class InventoryFirestore extends FirestoreService<Item> {
  protected basePath = 'inventory';
}
