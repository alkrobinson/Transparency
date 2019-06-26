import {
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  environment
} from '../../environments/environment';
import {
  HttpClient,
  HttpErrorResponse
} from '@angular/common/http';
import {
  ChartComponent
} from 'angular2-chartjs';
import {
  Router,
  ActivatedRoute
} from '@angular/router';
import {
  IgxToastPosition,
  IgxInputGroupComponent,
  IgxDropDownComponent,
  OverlaySettings,
  ConnectedPositioningStrategy,
  BlockScrollStrategy
} from 'igniteui-angular';

import {
  Globals
} from '../globals';
import { timeout } from 'q';

const INPUT_URL1 = environment.inputURL1;
const INPUT_URL2 = environment.inputURL2;
const INPUT_URL3 = environment.inputURL3;
const INPUT_URL4 = environment.inputURL4;
const stValidYearUrl = environment.validYearUrl;

let queryURL;
let pathname;

@Component({
  selector: 'app-top-layer-chart',
  templateUrl: './top-layer-chart.component.html',
  styleUrls: ['./top-layer-chart.component.scss']
})

export class TopLayerChartComponent implements OnInit {
  public stParamGraph;
  public stParamType;
  public stParamYear;
  public data1 = [];
  public arrowYear = 'arrow_drop_down';
  public data2 = ['Fund', 'Type'];
  public arrowType = 'arrow_drop_down';

  private _overlaySettings1: OverlaySettings = {
    closeOnOutsideClick: true,
    modal: false,
    positionStrategy: new ConnectedPositioningStrategy(),
    scrollStrategy: new BlockScrollStrategy()
  };

  private _overlaySettings2: OverlaySettings = {
    closeOnOutsideClick: true,
    modal: false,
    positionStrategy: new ConnectedPositioningStrategy(),
    scrollStrategy: new BlockScrollStrategy()
  };

  @ViewChild('chart') public mychart: ChartComponent;
  @ViewChild('dropdownYear') public myYearDrop: IgxDropDownComponent;
  @ViewChild('inputGroupYear', {
    read: IgxInputGroupComponent
  }) public inputGroupYear: IgxInputGroupComponent;
  @ViewChild('inputYear') public inputYear: HTMLInputElement;
  @ViewChild('dropdownYear', {
    read: IgxDropDownComponent
  }) public dropdownYear: IgxDropDownComponent;
  @ViewChild('inputGroupType', {
    read: IgxInputGroupComponent
  }) public inputGroupType: IgxInputGroupComponent;
  @ViewChild('inputType') public inputType: HTMLInputElement;
  @ViewChild('dropdownType', {
    read: IgxDropDownComponent
  }) public dropdownType: IgxDropDownComponent;

  public masterData: any;
  public totalsData: any;
  type = 'horizontalBar';
  data = {
    labels: [''],
    datasets: [{
      label: '',
      data: [0],
      backgroundColor: ''
    }]
  };
  options = {
    responsive: true,
    maintainAspectRatio: false,
    tooltips: {
      callbacks: {
        label: function (tooltipItem) {
          return (parseFloat(tooltipItem.xLabel) * 1000000).toLocaleString('en-US', {style: 'decimal', maximumFractionDigits: 2,
           minimumFractionDigits: 2});

        },

      }
    },
    scales: {
      yAxes: [{
        scaleLabel: {
          display: true,
          fontSize: 30

        },
        ticks: {
          fontSize: 20,
        }
      }],
      xAxes: [{
        position: 'top',
        scaleLabel: {
          display: true,
          labelString: 'Dollars(in millions)',
          fontSize: 30,
        },
        ticks: {
          min: 0,
          fontSize: 20,
          callback: function (value) {
            return value.toLocaleString('en-US', {style: 'decimal', maximumFractionDigits: 2});
          }

        }
      }]

    },
    legend: {
      position: 'bottom',
      labels: {
        fontSize: 20
      }
    }
  };

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router, private globals: Globals) {}

  public ngOnInit(): void {
    // create the combo dropdown year values
    this.http.get(stValidYearUrl + this.globals.session).subscribe(data => {
      const years = Object.values(data);
      for (let i = 0; i < years.length; i++) {
        this.data1.push(years[i]['title_year']);
      }
    });

    this.route.paramMap.subscribe(params => {
      // get path once parms change
      pathname = window.location.pathname.split('/');
      // get year type from url and change combo to match
      this.stParamType = params.get('type');
      this.stParamGraph = (pathname.includes('revenue')) ? 'Revenue' : 'Expense';
      if (params.get('year') === 'notset') {
        this.stParamYear = this.globals.currentYear;
        if (this.stParamGraph === 'Revenue') {
          this.router.navigateByUrl('/revenue/' + this.stParamType + '/' + this.stParamYear);
        } else {
          this.router.navigateByUrl('/expense/' + this.stParamType + '/' + this.stParamYear);
        }

      } else {
        this.stParamYear = params.get('year');
      }



      // selected revenue
      document.getElementById('title').innerHTML = this.stParamGraph;
      if (this.stParamGraph === 'Revenue') {
        // if selected type
        queryURL = (this.stParamType === 'Type') ? INPUT_URL2 + this.globals.session + '&y=' +
          this.stParamYear : INPUT_URL4 + this.globals.session + '&y=' + this.stParamYear;
      } else {
        queryURL = (this.stParamType === 'Type') ? INPUT_URL1 + this.globals.session + '&y=' +
          this.stParamYear : INPUT_URL3 + this.globals.session + '&y=' + this.stParamYear;
      }
      this.get_Data(queryURL);
      this.get_Data(queryURL + '&t', 'type');
    });


  }


  public toggledYear() {
    this._overlaySettings1.positionStrategy.settings.target = this.inputGroupYear.element.nativeElement;
    this.dropdownYear.toggle(this._overlaySettings1);
    this.arrowYear = 'arrow_drop_up';
  }

  public selectYear(args) {
    this.stParamYear = this.data1[args.newSelection.index];
    if (pathname.includes('revenue')) {
      this.router.navigateByUrl('/revenue/' + this.stParamType + '/' + this.stParamYear);
    } else {
      this.router.navigateByUrl('/expense/' + this.stParamType + '/' + this.stParamYear);
    }
  }

  public onYearClosed() {
    this.arrowYear = 'arrow_drop_down';
  }

  public toggledType() {
    this._overlaySettings2.positionStrategy.settings.target = this.inputGroupType.element.nativeElement;
    this.dropdownType.toggle(this._overlaySettings2);
    this.arrowType = 'arrow_drop_up';
  }

  public selectType(args) {
    this.stParamType = this.data2[args.newSelection.index];
    if (pathname.includes('revenue')) {
      this.router.navigateByUrl('/revenue/' + this.stParamType + '/' + this.stParamYear);
    } else {
      this.router.navigateByUrl('/expense/' + this.stParamType + '/' + this.stParamYear);
    }
  }

  public onTypeClosed() {
    this.arrowType = 'arrow_drop_down';
  }

  public show() {
    const toast = document.getElementById('toast');
    toast.setAttribute('position', IgxToastPosition.Top.toString());
  }

  /*
  // For random colors
  public getRandomColor(): string {
    const letters = '0123456789ABCDEF'.split('');
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
*/

  // User clicked on bar
  public output(e: any, toast): void {
    // console.log('clicked bar');
    // console.log(e);
    if (pathname.includes('expense')) {
      this.router.navigateByUrl('/expense/' + this.stParamType + '/' + this.stParamYear + '/' +
        this.data.labels[e[0]['_index']].toString().replace(/ /g, '_') + '/' +
        ((parseInt(this.masterData[e[0]['_index']].pk, 0)).toString()));
    } else {
      this.router.navigateByUrl('/revenue/' + this.stParamType + '/' + this.stParamYear + '/' +
        this.data.labels[e[0]['_index']].toString().replace(/ /g, '_') + '/' +
        ((parseInt(this.masterData[e[0]['_index']].pk, 0)).toString()));
    }
  }

  public clickedCanvas(canvasEvent, toast) {
    // console.log('clicked canvas');
    // console.log(canvasEvent);

    const xPos = canvasEvent.offsetX;
    const yPos = canvasEvent.offsetY;

    const xStart = this.mychart['chart']['scales']['y-axis-0']['left'];
    const xEnd = this.mychart['chart']['scales']['y-axis-0']['right'];
    const blockHeight = (this.mychart['chart']['scales']['y-axis-0']['bottom'] -
      this.mychart['chart']['scales']['y-axis-0']['top']) / this.mychart['chart']['scales']['y-axis-0']['ticks'].length;

    let yStart = this.mychart['chart']['scales']['y-axis-0']['top'];
    let yEnd = yStart;
    let temp = -1;
    this.mychart['chart']['scales']['y-axis-0']['ticks'].forEach(function (value, key) {
      yEnd += blockHeight;
      if (xEnd >= xPos && xPos >= xStart && yEnd >= yPos && yPos >= yStart) {
        temp = key;

      }
      yStart = yEnd;
    });
    if (temp >= 0) {
      if (pathname.includes('expense')) {
        this.router.navigateByUrl('/expense/' + this.stParamType + '/' + this.stParamYear + '/' +
          this.data.labels[temp].toString().replace(/ /g, '_') + '/' +
          ((parseInt(this.masterData[temp].pk, 0)).toString()));
      } else {
        this.router.navigateByUrl('/revenue/' + this.stParamType + '/' + this.stParamYear + '/' +
          this.data.labels[temp].toString().replace(/ /g, '_') + '/' +
          ((parseInt(this.masterData[temp].pk, 0)).toString()));
      }
    }

  }

  public mouseMove(canvasEvent) {
    // console.log('on-hover');
    // console.log(canvasEvent);
    const d = document.getElementById('tooltipDiv');
    const xPos = canvasEvent.offsetX;
    const yPos = canvasEvent.offsetY;

    const xStart = this.mychart['chart']['scales']['y-axis-0']['left'];
    const xEnd = this.mychart['chart']['scales']['y-axis-0']['right'];
    const blockHeight = (this.mychart['chart']['scales']['y-axis-0']['bottom'] -
      this.mychart['chart']['scales']['y-axis-0']['top']) / this.mychart['chart']['scales']['y-axis-0']['ticks'].length;

    let yStart = this.mychart['chart']['scales']['y-axis-0']['top'];
    let yEnd = yStart;
    let temp = -1;
    this.mychart['chart']['scales']['y-axis-0']['ticks'].forEach(function (value, key) {
      yEnd += blockHeight;
      if (xEnd >= xPos && xPos >= xStart && yEnd >= yPos && yPos >= yStart) {
        temp = key;
        d.hidden = false;

      } else {
        d.hidden = true;

      }
      yStart = yEnd;
    });
    if (temp >= 0) {
      d.style.position = 'absolute';
      d.style.left = xStart + 20 + 'px';
      d.style.top = canvasEvent.pageY + 20 + 'px';
      d.style.width = xEnd - (xStart + 20) + 'px';
      if (!this.masterData[temp].tooltip) {
        d.hidden = true;
      } else {
        d.hidden = false;
        d.innerText = this.masterData[temp].tooltip.toString();
      }

    }
  }


  public get_Data(url: string, type = null) {
    if (type == null) {
      interface RevenueObjects {
        title: string;
        budget: string;
        revenue: string;
        balance: string;
        has_children: string;
      }

      this.http.get < RevenueObjects[] > (url).subscribe(data => {
          this.masterData = data;
          document.getElementById('loaded').setAttribute('hidden', 'hidden');
          document.getElementById('wait').removeAttribute('hidden');
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            console.log('Client-side error occurred.');
          } else {
            console.log('Server-side error occurred.');
          }
        }, () => {
          // console.log(this.masterData[0].has_children);
          const tempLabel = [];
          const tempBudget = [];
          const tempRevenue = [];
          if (pathname.includes('expense')) {
            this.masterData.forEach(function (value) {
              const unrounded_budget = value.appropriation / 1000000;
              const unrounded_revenue = value.expenditures / 1000000;
              tempLabel.push(value.title);
              tempBudget.push(unrounded_budget);
              tempRevenue.push(unrounded_revenue);
            });
          } else {
            this.masterData.forEach(function (value) {
              const unrounded_budget = value.adjusted_estimate / 1000000;
              const unrounded_revenue = value.revenues / 1000000;
              tempLabel.push(value.title);
              tempBudget.push(unrounded_budget);
              tempRevenue.push(unrounded_revenue);
            });
          }
          this.data = {
            labels: tempLabel,
            datasets: [{
              label: 'Budget',
              data: tempBudget,
              backgroundColor: '#196FE4'
            }, {
              label: 'Actual',
              data: tempRevenue,
              backgroundColor: '#1BE44D'
            }]
          };
          document.getElementById('chart1').setAttribute('style', 'height:' + (this.masterData.length * 100).toString() + 'px');
        }
      );
    } else {

      this.http.get(url).subscribe(data => {
          this.totalsData = data;
          if (this.stParamGraph === 'Revenue') {

            document.getElementById('totals').innerHTML = '<b>Adopted Budget:</b> ' +
              this.totalsData[0].estimate.toLocaleString('en-US', {style: 'decimal', maximumFractionDigits: 2,
              minimumFractionDigits: 2}) + '<br>' +
              '<b>Revenue To Date:</b> ' +
              this.totalsData[0].revenue.toLocaleString('en-US', {style: 'decimal', maximumFractionDigits: 2,
              minimumFractionDigits: 2});
          } else {
            document.getElementById('totals').innerHTML = '<b>Adopted Budget:</b> ' +
              this.totalsData[0].appropriation.toLocaleString('en-US', {style: 'decimal', maximumFractionDigits: 2,
              minimumFractionDigits: 2}) + '<br>' +
              '<b>Expenses To Date:</b> ' +
              this.totalsData[0].expenditures.toLocaleString('en-US', {style: 'decimal', maximumFractionDigits: 2,
              minimumFractionDigits: 2});

          }
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            console.log('Client-side error occurred.');
          } else {
            console.log('Server-side error occurred.');
          }
        });
    }
  }
}
