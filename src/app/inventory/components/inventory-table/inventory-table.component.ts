import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { InventoryService } from '../../services/inventory.service';
import { Item } from '../../models/item';

@Component({
  selector: 'app-inventory-table',
  templateUrl: './inventory-table.component.html',
  styleUrls: ['./inventory-table.component.css']
})
export class InventoryTableComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  loading$: Observable<boolean>;
  items$: Observable<Item[]>;
  noResults$: Observable<boolean>;
  displayedColumns: string[] = [
    'id',
    'name',
    'genericName',
    'supplier',
    'quantity',
    'expiryDate',
    'purchaseDate',
    'purchasePrice',
    'retailPrice'
  ];
  dataSource: MatTableDataSource<Item>;

  constructor(private inventory: InventoryService) {}

  ngOnInit() {
    this.loading$ = this.inventory.loading$;
    this.noResults$ = this.inventory.noResults$;
    this.items$ = this.inventory.items$;
    this.items$.subscribe(items => {
      this.dataSource = new MatTableDataSource(items);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
