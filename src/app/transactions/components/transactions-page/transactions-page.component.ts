import { Component, OnInit } from '@angular/core';
import { StockService } from 'src/app/inventory/services/stock.service';

@Component({
  selector: 'app-transactions-page',
  templateUrl: './transactions-page.component.html',
  styleUrls: ['./transactions-page.component.css']
})
export class TransactionsPageComponent implements OnInit {
  constructor(public stock: StockService) {}

  ngOnInit() {}
}
