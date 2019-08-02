import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TransactionsService } from './../../services/transactions.service';
import { InventoryService } from '../../../inventory/services/inventory.service';
import { Observable } from 'rxjs';
import { Stock } from 'src/app/inventory/models/item';

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
  stock$: Observable<Stock[]>;
  noResults$: Observable<boolean>;
  status$: Observable<string>;
  formattedAmount: string;

  constructor(
    private transactions: TransactionsService,
    private inventory: InventoryService
  ) {}

  ngOnInit() {
    this.loading$ = this.inventory.loading$;
    this.noResults$ = this.inventory.noResults$;
    this.stock$ = this.inventory.stock$;
    this.status$ = this.transactions.formStatus$;
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
}
