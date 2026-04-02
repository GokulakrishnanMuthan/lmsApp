import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevoteComponent } from './devote.component';

describe('DevoteComponent', () => {
  let component: DevoteComponent;
  let fixture: ComponentFixture<DevoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DevoteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DevoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
