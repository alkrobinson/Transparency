import { Component, ElementRef, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';

import { Globals } from './globals';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute, private elementRef: ElementRef,
     private globals: Globals, private GCroute: AppRoutingModule) {
    const native = this.elementRef.nativeElement;
    this.globals.session = native.getAttribute('gc_id');
    this.globals.currentYear = native.getAttribute('gc_year');
    this.GCroute.refreshRouting();
  }

  public ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.GCroute.refreshRouting();
    });
  }

}
