import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { InventoryService } from '../../services/inventory.service';
import { Item } from '../../models/item';

@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.css']
})
export class InventoryListComponent implements OnInit {
  loading$: Observable<boolean>;
  items$: Observable<Item[]>;
  noResults$: Observable<boolean>;

  constructor(private inventory: InventoryService) {}

  ngOnInit() {
    this.loading$ = this.inventory.loading$;
    this.noResults$ = this.inventory.noResults$;
    this.items$ = this.inventory.items$;
  }

  delete(item: Item) {
    this.inventory.delete(item.id);
  }
}
