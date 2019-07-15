import { Component, OnInit, ElementRef } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { InventoryService } from './../../services/inventory.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-inventory-form',
  templateUrl: './inventory-form.component.html',
  styleUrls: ['./inventory-form.component.css']
})
export class InventoryFormComponent implements OnInit {
  form: FormGroup = new FormGroup({
    id: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    genericName: new FormControl('', Validators.required),
    supplier: new FormControl('', Validators.required),
    quantity: new FormControl('', Validators.required),
    expiryDate: new FormControl('', Validators.required),
    purchaseDate: new FormControl('', Validators.required),
    purchasePrice: new FormControl('', Validators.required),
    retailPrice: new FormControl('', Validators.required)
  });
  status$: Observable<string>;
  formattedAmount: string;

  constructor(
    private inventory: InventoryService,
    private currencyPipe: CurrencyPipe
  ) {}

  ngOnInit() {
    this.status$ = this.inventory.formStatus$;
  }

  isInvalid(name: string | number) {
    return (
      this.form.controls[name].invalid &&
      (this.form.controls[name].dirty || this.form.controls[name].touched)
    );
  }

  transformDecimal(name: string) {
    const amount: number = this.form.get(name).value;
    this.form.controls[name].patchValue(amount.toFixed(2));
  }

  async submit() {
    this.form.disable();
    await this.inventory.create({ ...this.form.value });
    this.form.reset();
    this.form.enable();
  }
}
