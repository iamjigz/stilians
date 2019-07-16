import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { InventoryService } from '../../services/inventory.service';
import { Item } from '../../models/item';

@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.css']
})
export class InventoryListComponent implements OnInit {
  @Input() data: Observable<Item[]>;
  items$: Observable<Item[]>;

  constructor(private inventory: InventoryService) {}

  ngOnInit() {
    this.items$ = this.data;
  }

  delete(item: Item) {
    this.inventory.delete(item.ref);
  }

  update(item: Item) {}
}
