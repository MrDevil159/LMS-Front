import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeavesOutletComponent } from './leaves-outlet.component';

describe('LeavesOutletComponent', () => {
  let component: LeavesOutletComponent;
  let fixture: ComponentFixture<LeavesOutletComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LeavesOutletComponent]
    });
    fixture = TestBed.createComponent(LeavesOutletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
