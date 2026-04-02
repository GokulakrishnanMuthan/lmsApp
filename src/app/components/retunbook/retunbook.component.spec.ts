import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetunbookComponent } from './retunbook.component';

describe('RetunbookComponent', () => {
  let component: RetunbookComponent;
  let fixture: ComponentFixture<RetunbookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RetunbookComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RetunbookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
