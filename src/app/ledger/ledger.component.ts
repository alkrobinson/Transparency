import {
  environment
} from './../../environments/environment';
import {
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse
} from '@angular/common/http';
import {
  ActivatedRoute
} from '@angular/router';
import * as moment from 'moment';
import {
  IgxExporterOptionsBase,
  IGridToolbarExportEventArgs,
  IgxGridComponent
} from 'igniteui-angular';
import {
  Globals
} from '../globals';
import { getTNode } from '@angular/core/src/render3/util';

import is from 'is_js';

const INPUT_URL5 = environment.inputURL5;
let queryURL;
let sublayerId;
let pathname;
let pathLength;
let graphType;

@Component({
  selector: 'app-ledger',
  templateUrl: './ledger.component.html',
  styleUrls: ['./ledger.component.scss']
})

export class LedgerComponent implements OnInit {

  @ViewChild('ledgerGrid') public grid: IgxGridComponent;

  public masterData: any;
  public convData: any[];
  public notSupported = false;

  title = 'Checkbook';
  constructor(private http: HttpClient, private route: ActivatedRoute, private globals: Globals) {}

  ngOnInit() {

    if (is.ie()) {
      this.notSupported = true;
    }

    this.route.paramMap.subscribe(params => {
      // get path once parms change
      pathname = window.location.pathname.split('/');
      pathLength = pathname.length;
      // Very last in path should be ID
      sublayerId = pathname[pathLength - 1];
      graphType = pathname[pathLength - 4];
      queryURL = INPUT_URL5 + this.globals.session + '&p=' + sublayerId + '&type=' + graphType;
      interface RevenueObjects {
        date: string;
        vendor: string;
        description: string;
        amount: string;
        category: string;
        fund: string;
      }
      this.http.get < RevenueObjects > (queryURL).subscribe(data => {
          this.masterData = data;
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            console.log('Client-side error occurred.');
          } else {
            console.log('Server-side error occurred.');
          }
        }, () => {
          const tempData = [];

          this.masterData.forEach(function (value) {
            tempData.push({
              'date': (value['date'].length > 0) ? new Date(value['date']) : null,
              'vendor': (value['vendor']),
              'description': (value['category']),
              'fund': (value['fund']),
              'amount': (value['amount']),
              'paymentType': (value['debit_credit'])
            });
          });
          this.convData = tempData;
        });
    });


  }

  public toolbarExportingHandler(args: IGridToolbarExportEventArgs) {
    // You can customize the exporting from this event
    const options: IgxExporterOptionsBase = args.options;
    const start_index = window.location.href.split('/').indexOf('expense');
    const title = window.location.href.split('/').splice(start_index).join();
    options.fileName = title;
  }

  public formatDate(date: Date) {
    const options = {
      month: '2-digit',
      day: '2-digit',
      year: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
  }

  public formatMoney(val: number) {
    if (val != null) {
      return val.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
  }

}
