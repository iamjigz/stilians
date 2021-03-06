import { InventoryState } from '../states/inventory.state';
import { StoreService } from 'src/app/core/services/store.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InventoryPageStore extends StoreService<InventoryState> {
  protected store = 'inventory-page';

  constructor() {
    super({
      loading: true,
      items: []
    });
  }
}
