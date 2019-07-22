import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { InventoryService } from '../../services/inventory.service';
import { Item, Stock } from '../../models/item';

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
    this.stock$ = this.data;
  }

  delete(item: Item) {
    this.inventory.delete(item.ref);
  }

  update(item: Item) {}
}
