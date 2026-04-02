import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportbooklentbookwiseComponent } from './reportbooklentbookwise.component';

describe('ReportbooklentbookwiseComponent', () => {
  let component: ReportbooklentbookwiseComponent;
  let fixture: ComponentFixture<ReportbooklentbookwiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportbooklentbookwiseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportbooklentbookwiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
