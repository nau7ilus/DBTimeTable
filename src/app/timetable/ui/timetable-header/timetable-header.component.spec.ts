import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimetableHeaderComponent } from './timetable-header.component';

describe('TimetableHeaderComponent', () => {
  let component: TimetableHeaderComponent;
  let fixture: ComponentFixture<TimetableHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimetableHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimetableHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
