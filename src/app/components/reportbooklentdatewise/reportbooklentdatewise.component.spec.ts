import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportbooklentdatewiseComponent } from './reportbooklentdatewise.component';

describe('ReportbooklentdatewiseComponent', () => {
  let component: ReportbooklentdatewiseComponent;
  let fixture: ComponentFixture<ReportbooklentdatewiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportbooklentdatewiseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportbooklentdatewiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
