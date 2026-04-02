import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewbookissueComponent } from './newbookissue.component';

describe('NewbookissueComponent', () => {
  let component: NewbookissueComponent;
  let fixture: ComponentFixture<NewbookissueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewbookissueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewbookissueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
