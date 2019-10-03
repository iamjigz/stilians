import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TransactionsRoutingModule } from './transactions-routing.module';
import { CoreModule } from '../core/modules/core.module';

import { TransactionsPageComponent } from './components/transactions-page/transactions-page.component';
import { TransactionsFormComponent } from './components/transactions-form/transactions-form.component';

@NgModule({
  declarations: [TransactionsPageComponent, TransactionsFormComponent],
  imports: [
    CommonModule,
    TransactionsRoutingModule,
    ReactiveFormsModule,
    CoreModule
  ],
  exports: [TransactionsPageComponent, TransactionsFormComponent]
})
export class TransactionsModule {}
