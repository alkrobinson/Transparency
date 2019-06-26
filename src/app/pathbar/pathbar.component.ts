import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';
import { Globals } from '../globals';

const pathURL = environment.pathURL;

@Component({
  selector: 'app-pathbar',
  templateUrl: './pathbar.component.html',
  styleUrls: ['./pathbar.component.scss']
})
export class PathbarComponent implements OnInit {
  @Input() session: string;
  @Input() graphType: string;
  @Input() filterType: string;
  @Input() year: string;
  @Input() subLayers: string;
  @Input() sublayerId: string;
  // public stPathHtml = '';
  public arrPath;
  constructor(private http: HttpClient, private route: ActivatedRoute, private globals: Globals) { }
  ngOnInit() {
    this.route.paramMap.subscribe(
      params => {
        // if on a sublayer
        if (params.get('sublayerId')) {
          const stUrl = pathURL + this.globals.session + '&i=' + params.get('sublayerId').toString()
            + '&g=' + this.graphType + '&t=' + params.get('type').toString();
          this.http.get(stUrl).subscribe(data => {
            this.arrPath = Object.values(data);
          });

        }


      });

  }
}
