import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimetableMarqueeComponent } from './timetable-marquee.component';

describe('TimetableMarqueeComponent', () => {
  let component: TimetableMarqueeComponent;
  let fixture: ComponentFixture<TimetableMarqueeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimetableMarqueeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimetableMarqueeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
