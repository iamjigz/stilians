import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TransactionsRoutingModule } from './transactions-routing.module';
import { CoreModule } from '../core/modules/core.module';

import { TransactionsPageComponent } from './components/transactions-page/transactions-page.component';

@NgModule({
  declarations: [TransactionsPageComponent],
  imports: [
    CommonModule,
    TransactionsRoutingModule,
    ReactiveFormsModule,
    CoreModule
  ]
})
export class TransactionsModule {}
