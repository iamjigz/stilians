import { Component, OnInit } from '@angular/core';

import { InventoryService } from '../../services/inventory.service';
import { StockService } from '../../services/stock.service';

@Component({
  selector: 'app-inventory-page',
  templateUrl: './inventory-page.component.html',
  styleUrls: ['./inventory-page.component.css']
})
export class InventoryPageComponent implements OnInit {
  constructor(public inventory: InventoryService, public stock: StockService) {}

  ngOnInit() {}
}
