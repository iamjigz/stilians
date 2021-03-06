import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';

// Modules
import { MaterialModule } from './core/modules/material.module';
import { CoreModule } from './core/modules/core.module';
import { HomeModule } from './home/home.module';
import { InventoryModule } from './inventory/inventory.module';
import { TransactionsModule } from './transactions/transactions.module';

// Components
import { AppComponent } from './app.component';
import { NavigationComponent } from './navigation/navigation.component';

import { CurrencyPipe } from '@angular/common';

@NgModule({
  declarations: [AppComponent, NavigationComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    CoreModule,
    HomeModule,
    InventoryModule,
    TransactionsModule
  ],
  providers: [CurrencyPipe],
  bootstrap: [AppComponent]
})
export class AppModule {}
