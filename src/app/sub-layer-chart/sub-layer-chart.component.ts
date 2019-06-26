import {
  Component,
  ViewChild,
  OnInit
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
  IgxToastPosition
} from 'igniteui-angular';
import {
  Router,
  ActivatedRoute
} from '@angular/router';
import {
  Globals
} from '../globals';

const INPUT_URL1 = environment.inputURL1;
const INPUT_URL2 = environment.inputURL2;
const INPUT_URL3 = environment.inputURL3;
const INPUT_URL4 = environment.inputURL4;
let queryURL;
let pathname;

@Component({
  selector: 'app-sub-layer-chart',
  templateUrl: './sub-layer-chart.component.html',
  styleUrls: ['./sub-layer-chart.component.scss']
})
export class SubLayerChartComponent implements OnInit {

  public stSubLayerId;
  public stParamGraph;
  public stParamType;
  public stParamYear;
  public subLayerList = [];
  @ViewChild('chart3') public mychart3: ChartComponent;
  @ViewChild('chart2') public mychart2: ChartComponent;
  @ViewChild('ledgerGrid') public ledger;
  public toastPosition: IgxToastPosition;
  public masterData: any;
  public totalsData: any;
  public mychart;
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
        label: function (tooltipItem, data) {
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
          suggestedMin: 0,
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
    this.route.paramMap.subscribe(
      params => {
        // get path once parms change
        pathname = window.location.pathname.split('/');
        this.stSubLayerId = params.get('sublayerId').toString();
        // Set the attributes for the path
        this.stParamYear = params.get('year').toString();
        this.stParamType = params.get('type').toString();
        this.stParamGraph = (pathname.includes('expense')) ? 'Expense' : 'Revenue';
        document.getElementById('title').innerHTML = this.stParamGraph;

        if (this.stParamGraph === 'Expense') {
          if (this.stParamType === 'Type') {
            queryURL = INPUT_URL1 + this.globals.session + '&p=' + this.stSubLayerId;
          } else {
            queryURL = INPUT_URL3 + this.globals.session + '&p=' + this.stSubLayerId;
            // document.getElementById('Ledger').removeAttribute('hidden');
          }
        } else {
          if (this.stParamType === 'Type') {
            queryURL = INPUT_URL2 + this.globals.session + '&p=' + this.stSubLayerId.toString();
          } else {
            queryURL = INPUT_URL4 + this.globals.session + '&p=' + this.stSubLayerId.toString();
          }
        }
        this.getData();
        this.getData('type');

      });

  }

  public statgetRandomColor(): string {
    const letters = '0123456789ABCDEF'.split('');
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  /*
  public output(e: any, toast): void {
    console.log('clicked bar');
    console.log(e);
    let stRouteURL = '';
    this.toastPosition = IgxToastPosition.Middle;
    // array holding path
    const arrUrlParts = window.location.pathname.split('/');
    // next layer's pk
    const stLayerPk = ((parseInt(this.masterData[e[0]['_index']].pk, 0)).toString());
    // next layer's title
    const stLayerTitle = this.masterData[e[0]['_index']].title.replace('/', '_');
    // console.log(stLayerTitle);
    // Complete url
    stRouteURL = this.stParamGraph.toLowerCase() + '/' + this.stParamType + '/' +
      this.stParamYear + '/' + stLayerTitle + '/' + stLayerPk;
    stRouteURL = stRouteURL.split(' ').join('_');
    // Drill down if there is another sublayer
    const bHasChildren = this.masterData[e[0]['_index']].has_children;
    if (bHasChildren) {
      this.router.navigateByUrl(stRouteURL);
    } else {
      toast.show();
    }
  }
  */


  public clickedCanvas(canvasEvent, toast) {
    // console.log('clicked canvas');
    // console.log(this.mychart);

    const xPos = canvasEvent.offsetX;
    const yPos = canvasEvent.offsetY;
    if ( this.stParamGraph === 'Revenue') {
      this.mychart = this.mychart3;

    } else {
      this.mychart = this.mychart2;

    }

    const xStart = this.mychart['chart']['scales']['y-axis-0']['left'];
    const xEnd = this.mychart['chart']['width']; // this.mychart['chart']['scales']['y-axis-0']['right'];
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
      // console.log(temp);
      let stRouteURL = '';
      this.toastPosition = IgxToastPosition.Middle;
      // array holding path
      const arrUrlParts = window.location.pathname.split('/');
      // next layer's pk
      const stLayerPk = ((parseInt(this.masterData[temp].pk, 0)).toString());
      // next layer's title
      const stLayerTitle = this.masterData[temp].title.replace('/', '_');
      // Complete url
      stRouteURL = this.stParamGraph.toLowerCase() + '/' + this.stParamType + '/' +
        this.stParamYear + '/' + stLayerTitle + '/' + stLayerPk;
      stRouteURL = stRouteURL.split(' ').join('_');
      // Drill down if there is another sublayer
      const bHasChildren = this.masterData[temp].has_children;
      if (bHasChildren) {
        this.router.navigateByUrl(stRouteURL);
      } else {
        toast.show();
      }
    }

  }

  public getData(type = null) {
    if (type == null) {
      interface RevenueObjects {
        title: string;
        budget: string;
        revenue: string;
        balance: string;
        has_children: string;
      }

      this.http.get < RevenueObjects[] > (queryURL).subscribe(data => {
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
          let unrounded_budget;
          let unrounded_revenue;
          if (pathname.includes('expense')) {
            this.masterData.forEach(function (value) {
              unrounded_budget = value.appropriation / 1000000;
              unrounded_revenue = value.expenditures / 1000000;
              tempLabel.push(value.title);
              tempBudget.push(unrounded_budget);
              tempRevenue.push(unrounded_revenue);
            });
          } else {
            this.masterData.forEach(function (value) {
              unrounded_budget = value.adjusted_estimate / 1000000;
              unrounded_revenue = value.revenues / 1000000;
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
          if (this.masterData.length === 1) {
            if ( this.stParamGraph === 'Revenue') {
              document.getElementById('chart3').setAttribute('style', 'height:' + (this.masterData.length * 200).toString() + 'px');

            } else {
              document.getElementById('chart2').setAttribute('style', 'height:' + (this.masterData.length * 200).toString() + 'px');

            }

          } else {
            if ( this.stParamGraph === 'Revenue') {
              document.getElementById('chart3').setAttribute('style', 'height:' + (this.masterData.length * 100).toString() + 'px');

            } else {
              document.getElementById('chart2').setAttribute('style', 'height:' + (this.masterData.length * 100).toString() + 'px');

            }

          }
        }
      );
    } else {

      this.http.get(queryURL + '&t').subscribe(data => {
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

  public tabClicked() {
    window.dispatchEvent(new Event('resize'));

  }

}
