import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ChartModule } from 'angular2-chartjs';
import { MatTabsModule } from '@angular/material';
import { MatDividerModule } from '@angular/material';
import {
  IgxNavigationDrawerModule,
  IgxNavbarModule,
  IgxLayoutModule,
  IgxRippleModule,
  IgxCardModule,
  IgxInputGroupModule,
  IgxIconModule,
  IgxDropDownModule,
  IgxToastModule,
  IgxExcelExporterService,
  IgxCsvExporterService,
  IgxGridModule
} from 'igniteui-angular';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { TopLayerChartComponent } from './top-layer-chart/top-layer-chart.component';
import { SubLayerChartComponent } from './sub-layer-chart/sub-layer-chart.component';
import { LedgerComponent } from './ledger/ledger.component';
import { PathbarComponent } from './pathbar/pathbar.component';

import { Globals } from './globals';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TopLayerChartComponent,
    SubLayerChartComponent,
    LedgerComponent,
    PathbarComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    IgxNavigationDrawerModule,
    IgxNavbarModule,
    IgxLayoutModule,
    IgxRippleModule,
    IgxCardModule,
    IgxInputGroupModule,
    IgxIconModule,
    IgxDropDownModule,
    HttpClientModule,
    ChartModule,
    IgxToastModule,
    IgxInputGroupModule,
    MatTabsModule,
    MatDividerModule,
    IgxGridModule
  ],
  providers: [IgxExcelExporterService, IgxCsvExporterService, Globals],
  bootstrap: [AppComponent]
})
export class AppModule { }
