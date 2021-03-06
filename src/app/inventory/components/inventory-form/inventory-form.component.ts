import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormGroupDirective
} from '@angular/forms';
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
    purchaseDate: new FormControl(new Date(), Validators.required),
    purchasePrice: new FormControl('', Validators.required),
    retailPrice: new FormControl('', Validators.required),
    totalPurchase: new FormControl('', Validators.required)
  });
  status$: Observable<string>;
  formattedAmount: string;

  constructor(private inventory: InventoryService) {}

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
    const value =
      this.form.get(name).value === '' ? 0 : this.form.get(name).value;
    const amount = isNaN(value) ? 0 : value;
    this.form.controls[name].patchValue(amount.toFixed(2));
  }

  transformUpper(name: string) {
    const value =
      this.form.get(name).value === '' ? '' : this.form.get(name).value;
    this.form.controls[name].patchValue(value.toUpperCase().trim());
  }

  getTotalPurchase() {
    const fv = this.form.value;
    const total = isNaN(fv.purchasePrice * fv.quantity)
      ? 0
      : fv.purchasePrice * fv.quantity;

    this.form.controls.totalPurchase.patchValue(total.toFixed(2));
  }

  async submit(formGroup: FormGroup, formDirective: FormGroupDirective) {
    this.form.disable();
    await this.inventory.create({ ...this.form.value });
    this.resetForm(formGroup, formDirective);
    this.form.enable();
  }

  resetForm(formGroup: FormGroup, formDirective: FormGroupDirective): void {
    formDirective.resetForm();
    formGroup.reset();
  }
}
