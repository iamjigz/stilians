import { Component, OnInit, Input } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormGroupDirective,
  AbstractControl
} from '@angular/forms';
import { TransactionsService } from './../../services/transactions.service';
import { StockService } from '../../../inventory/services/stock.service';
import { Observable } from 'rxjs';
import { Stock, Item } from 'src/app/inventory/models/item';
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
    timestamp: new FormControl(new Date(), Validators.required),
    user: new FormControl('', Validators.required)
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
  transaction: Transaction;

  discount = false;

  constructor(
    private transactions: TransactionsService,
    private stockService: StockService
  ) {}

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

  async submit(formGroup: FormGroup, formDirective: FormGroupDirective) {
    this.transactionForm.disable();
    await this.transactions.create({ ...this.transaction });
    this.orders.map(order => {
      this.stockService.deduct(order);
    });

    this.orders = [];
    this.transaction = undefined;
    this.resetForm(formGroup, formDirective);
    this.transactionForm.enable();
  }

  displayFn(): string | undefined {
    return this.selectedItem ? this.selectedItem.name : '';
  }

  resetForm(formGroup: FormGroup, formDirective: FormGroupDirective): void {
    formDirective.resetForm();
    formGroup.reset();
  }

  add(formGroup: FormGroup, formDirective: FormGroupDirective): void {
    if (formGroup.invalid) {
      return;
    }

    const formValue = this.itemForm.value;
    const order: Order = {
      name: formValue.search.name,
      quantity: formValue.quantity,
      price: formValue.search.price
    };

    this.orders.push(order);
    this.selectedItem = null;
    this.aggregate(this.orders);
    this.resetForm(formGroup, formDirective);
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
      orders,
      subtotal: this.sum(orders),
      discount: this.discount ? this.sum(orders) * -0.1 : 0,
      tax: this.sum(orders) * 0.1,
      total:
        this.sum(orders) +
        (this.discount ? this.sum(orders) * -0.1 : 0) +
        this.sum(orders) * 0.1,
      timestamp: this.transactionForm.get('timestamp').value
    };

    return (this.transaction = transaction);
  }

  onDiscountChange() {
    this.discount = !this.discount;
    return this.aggregate(this.orders);
  }
}
