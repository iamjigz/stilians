import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InventoryPageComponent } from './components/inventory-page/inventory-page.component';

const routes: Routes = [
  { path: 'inventory', component: InventoryPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryRoutingModule {}
