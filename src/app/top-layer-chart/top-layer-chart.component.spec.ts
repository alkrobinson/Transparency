import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopLayerChartComponent } from './top-layer-chart.component';

describe('TopLayerChartComponent', () => {
  let component: TopLayerChartComponent;
  let fixture: ComponentFixture<TopLayerChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TopLayerChartComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopLayerChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
