import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookwiseissuelistComponent } from './bookwiseissuelist.component';

describe('BookwiseissuelistComponent', () => {
  let component: BookwiseissuelistComponent;
  let fixture: ComponentFixture<BookwiseissuelistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookwiseissuelistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookwiseissuelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
