import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HolidayOutletComponent } from './holiday-outlet.component';

describe('HolidayOutletComponent', () => {
  let component: HolidayOutletComponent;
  let fixture: ComponentFixture<HolidayOutletComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HolidayOutletComponent]
    });
    fixture = TestBed.createComponent(HolidayOutletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
