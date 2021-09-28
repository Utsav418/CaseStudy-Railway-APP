import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainsScheduleComponent } from './trains-schedule.component';

describe('TrainsScheduleComponent', () => {
  let component: TrainsScheduleComponent;
  let fixture: ComponentFixture<TrainsScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrainsScheduleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainsScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
