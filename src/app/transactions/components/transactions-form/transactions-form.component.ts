import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TransactionsService } from './../../services/transactions.service';
import { InventoryService } from '../../../inventory/services/inventory.service';
import { Observable } from 'rxjs';
import { Stock } from 'src/app/inventory/models/item';
import { startWith, map } from 'rxjs/operators';
import { Order, Transaction } from '../../models/transaction';
import { MatOption } from '@angular/material';

@Component({
  selector: 'app-transactions-form',
  templateUrl: './transactions-form.component.html',
  styleUrls: ['./transactions-form.component.css']
})
export class TransactionsFormComponent implements OnInit {
  @Input() data: Observable<Stock[]>;

  transactionForm: FormGroup = new FormGroup({
    orders: new FormControl([], Validators.required),
    subtotal: new FormControl('', Validators.required),
    discount: new FormControl('', Validators.required),
    tax: new FormControl('', Validators.required),
    total: new FormControl('', Validators.required),
    timestamp: new FormControl(new Date(), Validators.required)
  });

  itemForm: FormGroup = new FormGroup({
    search: new FormControl('', Validators.required),
    quantity: new FormControl('', Validators.required)
  });

  formattedAmount: string;
  stock: Stock[];
  filteredStock$: Observable<Stock[]>;

  selectedItem: Stock;
  orders: Order[] = [];

  constructor(private transactions: TransactionsService) {}

  ngOnInit() {
    this.data.subscribe(data => (this.stock = data));

    this.filteredStock$ = this.itemForm.get('search').valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  private _filter(search: string): Stock[] {
    if (typeof search === 'object') {
      return [];
    }

    return this.stock.filter(stock =>
      stock.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  onSelectedItem(option: MatOption) {
    this.selectedItem = option.value;
  }

  isInvalid(name: string | number) {
    return (
      this.transactionForm.controls[name].invalid &&
      (this.transactionForm.controls[name].dirty ||
        this.transactionForm.controls[name].touched)
    );
  }

  async submit() {
    this.transactionForm.disable();
    await this.transactions.create({ ...this.transactionForm.value });
    this.transactionForm.reset();
    this.transactionForm.enable();
  }

  displayFn(): string | undefined {
    return this.selectedItem ? this.selectedItem.name : '';
  }

  add() {
    const formValue = this.itemForm.value;
    const order: Order = {
      name: formValue.search.name,
      quantity: formValue.quantity,
      price: formValue.search.price
    };

    this.orders.push(order);
    this.itemForm.reset();
    this.selectedItem = null;
  }

  sum(orders: Order[]) {
    if (orders == null) {
      return 0;
    }

    return orders.reduce((prev, curr) => {
      return prev == null ? prev : prev + curr.price * curr.quantity;
    }, 0);
  }

  aggregate(orders: Order[]) {
    const transaction: Transaction = {
      transid: '',
      orders,
      subtotal: this.sum(orders),
      discount: 0,
      tax: 0,
      total: 0
    };

    console.log(transaction);
  }
}
