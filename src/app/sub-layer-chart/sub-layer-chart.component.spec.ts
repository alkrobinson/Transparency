import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubLayerChartComponent } from './sub-layer-chart.component';

describe('SubLayerChartComponent', () => {
  let component: SubLayerChartComponent;
  let fixture: ComponentFixture<SubLayerChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SubLayerChartComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubLayerChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
