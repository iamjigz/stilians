import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';

import { InventoryService } from '../../services/inventory.service';
import { Item, Stock } from '../../models/item';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.css']
})
export class InventoryListComponent implements OnInit {
  @Input() data: Observable<Stock>;
  stock$: Observable<Stock>;

  constructor(private inventory: InventoryService) {}

  ngOnInit() {
    this.stock$ = this.data.pipe(
      map((stock: any) => stock.sort((prev, curr) => prev.total - curr.total))
    );
  }

  delete(item: Item) {
    this.inventory.delete(item.ref);
  }

  update(item: Item) {
    // TODO: Let user update item by clicking on the list
  }
}
