import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { InventoryService } from '../../services/inventory.service';
import { StockService } from '../../services/stock.service';
import { Item, Stock } from '../../models/item';

@Component({
  selector: 'app-inventory-page',
  templateUrl: './inventory-page.component.html',
  styleUrls: ['./inventory-page.component.css']
})
export class InventoryPageComponent implements OnInit {
  // loading$: Observable<boolean>;
  // items$: Observable<Item[]>;
  // stock$: Observable<Stock[]>;
  // noResults$: Observable<boolean>;

  constructor(public inventory: InventoryService, public stock: StockService) {}

  ngOnInit() {
    // this.loading$ = this.inventory.loading$;
    // this.noResults$ = this.inventory.noResults$;
    // this.items$ = this.inventory.items$;
    // this.stock$ = this.stock.stock$;
  }
}
