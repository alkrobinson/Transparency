import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PathbarComponent } from './pathbar.component';

describe('PathbarComponent', () => {
  let component: PathbarComponent;
  let fixture: ComponentFixture<PathbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PathbarComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PathbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
