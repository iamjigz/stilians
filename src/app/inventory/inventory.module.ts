import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { InventoryRoutingModule } from './inventory-routing.module';
import { CoreModule } from '../core/modules/core.module';

import { InventoryPageComponent } from './components/inventory-page/inventory-page.component';
import { InventoryListComponent } from './components/inventory-list/inventory-list.component';
import { InventoryFormComponent } from './components/inventory-form/inventory-form.component';

@NgModule({
  declarations: [
    InventoryPageComponent,
    InventoryListComponent,
    InventoryFormComponent
  ],
  imports: [
    CommonModule,
    InventoryRoutingModule,
    ReactiveFormsModule,
    CoreModule
  ]
})
export class InventoryModule {}
