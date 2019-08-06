import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TransactionsPageComponent } from './components/transactions-page/transactions-page.component';

const routes: Routes = [
  { path: 'transactions', component: TransactionsPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionsRoutingModule {}
