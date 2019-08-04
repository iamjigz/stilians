import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TransactionsService } from './../../services/transactions.service';
import { InventoryService } from '../../../inventory/services/inventory.service';
import { Observable } from 'rxjs';
import { Stock } from 'src/app/inventory/models/item';
import { startWith, map } from 'rxjs/operators';
import { Order } from '../../models/transaction';
import { MatOption } from '@angular/material';

@Component({
  selector: 'app-transactions-form',
  templateUrl: './transactions-form.component.html',
  styleUrls: ['./transactions-form.component.css']
})
export class TransactionsFormComponent implements OnInit {
  transactionForm: FormGroup = new FormGroup({
    orders: new FormControl([], Validators.required),
    subtotal: new FormControl('', Validators.required),
    discount: new FormControl('', Validators.required),
    tax: new FormControl('', Validators.required),
    total: new FormControl('', Validators.required)
  });

  itemForm: FormGroup = new FormGroup({
    search: new FormControl('', Validators.required),
    quantity: new FormControl('', Validators.required)
  });

  loading$: Observable<boolean>;
  noResults$: Observable<boolean>;
  status$: Observable<string>;
  formattedAmount: string;
  stock: Stock[];
  filteredStock$: Observable<Stock[]>;

  selectedItem: Stock;
  orders: Order[] = [];

  constructor(
    private transactions: TransactionsService,
    private inventory: InventoryService
  ) {}

  ngOnInit() {
    this.loading$ = this.inventory.loading$;
    this.noResults$ = this.inventory.noResults$;
    this.status$ = this.transactions.formStatus$;
    this.inventory.stock$.subscribe(data => (this.stock = data));

    this.filteredStock$ = this.itemForm.get('search').valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  private _filter(value: Stock) {
    const filterValue = value.name ? value.name.toLowerCase() : '';
    return this.stock.filter(stock =>
      stock.name.toLowerCase().includes(filterValue)
    );
  }

  isInvalid(name: string | number) {
    return (
      this.transactionForm.controls[name].invalid &&
      (this.transactionForm.controls[name].dirty ||
        this.transactionForm.controls[name].touched)
    );
  }

  transformDecimal(name: string) {
    const amount: number = this.transactionForm.get(name).value;
    this.transactionForm.controls[name].patchValue(amount.toFixed(2));
  }

  async submit() {
    this.transactionForm.disable();
    await this.transactions.create({ ...this.transactionForm.value });
    this.transactionForm.reset();
    this.transactionForm.enable();
  }

  displayFn(order?: Order): string | undefined {
    return order ? order.name : undefined;
  }

  onSelectedItem(option: MatOption) {
    this.selectedItem = option.value;
  }

  add() {
    console.log(this.itemForm.value);
    const formValue = this.itemForm.value;
    const order: Order = {
      name: formValue.search.name,
      quantity: formValue.quantity,
      price: formValue.search.price
    };

    console.log(order);
    this.orders.push(order);
  }
}
