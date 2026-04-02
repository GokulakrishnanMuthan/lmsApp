import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewdevoteComponent } from './newdevote.component';

describe('NewdevoteComponent', () => {
  let component: NewdevoteComponent;
  let fixture: ComponentFixture<NewdevoteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewdevoteComponent]
    });
    fixture = TestBed.createComponent(NewdevoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
