import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RackEditComponent } from './rack-edit.component';

describe('RackEditComponent', () => {
  let component: RackEditComponent;
  let fixture: ComponentFixture<RackEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RackEditComponent]
    });
    fixture = TestBed.createComponent(RackEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
