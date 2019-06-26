import { SubLayerChartComponent } from './sub-layer-chart/sub-layer-chart.component';
import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TopLayerChartComponent } from './top-layer-chart/top-layer-chart.component';

import { PageNotFoundComponent } from './error-routing/not-found/not-found.component';
import { UncaughtErrorComponent } from './error-routing/error/uncaught-error.component';
import { ErrorRoutingModule } from './error-routing/error-routing.module';

import { Globals } from './globals';

export let routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'revenue/:type/:year/:sublayerName/:sublayerId', component: SubLayerChartComponent },
  { path: 'expense/:type/:year/:sublayerName/:sublayerId', component: SubLayerChartComponent },
  { path: 'expense/:type/:year', component: TopLayerChartComponent},
  { path: 'revenue/:type/:year', component: TopLayerChartComponent },
  { path: 'error', component: UncaughtErrorComponent },
  { path: '**', component: PageNotFoundComponent } // must always be last
];

@NgModule({
  imports: [RouterModule.forRoot(routes), ErrorRoutingModule],
  exports: [RouterModule, ErrorRoutingModule]
})
export class AppRoutingModule {
  constructor(private globals: Globals) {
  }
  public refreshRouting() {
    routes = [
      { path: '', component: HomeComponent },
      { path: 'revenue/:type/:year/:sublayerName/:sublayerId', component: SubLayerChartComponent },
      { path: 'expense/:type/:year/:sublayerName/:sublayerId', component: SubLayerChartComponent },
      {
        path: 'expense/:type/:year', component: TopLayerChartComponent
      },
      {
        path: 'revenue/:type/:year', component: TopLayerChartComponent
      },
      { path: 'error', component: UncaughtErrorComponent },
      { path: '**', component: PageNotFoundComponent } // must always be last
    ];
  }

}
