import { environment } from './../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Globals } from '../globals';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  total = environment.totalsURL;

  constructor(private http: HttpClient, private router: Router, private globals: Globals) {
  }

  ngOnInit() {

    this.http.get(this.total + this.globals.session).subscribe(data => {
      const totals = Object.values(data);
      document.getElementById('rev_total').innerHTML +=
      totals[0].estimate.toLocaleString('en-US', {style: 'decimal', minimumFractionDigits: 2});
      document.getElementById('exp_total').innerHTML +=
       totals[1].appropriation.toLocaleString('en-US', {style: 'decimal', minimumFractionDigits: 2});
    });

  }

  public route(url: string) {
    if (url === 'rev') {
      this.router.navigateByUrl('/revenue/Type/' + this.globals.currentYear);
    } else {
      this.router.navigateByUrl('/expense/Type/' + this.globals.currentYear);
    }
  }

}
