import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimetableClockComponent } from './timetable-clock.component';

describe('TimetableClockComponent', () => {
  let component: TimetableClockComponent;
  let fixture: ComponentFixture<TimetableClockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimetableClockComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimetableClockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
