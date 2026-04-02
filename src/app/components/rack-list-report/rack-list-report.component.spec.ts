import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RackListReportComponent } from './rack-list-report.component';

describe('RackListReportComponent', () => {
  let component: RackListReportComponent;
  let fixture: ComponentFixture<RackListReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RackListReportComponent]
    });
    fixture = TestBed.createComponent(RackListReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
