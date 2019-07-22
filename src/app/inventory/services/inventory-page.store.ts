import { InventoryPage } from '../states/inventory-page';
import { StoreService } from 'src/app/core/services/store.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InventoryPageStore extends StoreService<InventoryPage> {
  protected store = 'inventory-page';

  constructor() {
    super({
      loading: true,
      items: [],
      stock: []
    });
  }
}
