import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-timetable-clock',
  standalone: true,
  imports: [],
  templateUrl: './timetable-clock.component.html',
  styleUrl: './timetable-clock.component.scss'
})
export class TimetableClockComponent implements OnInit, OnDestroy {
  time = new Date();
  private intervalId?: ReturnType<typeof setInterval>;


  ngOnInit(): void {
    this.intervalId = setInterval(() => {
      this.time = new Date();
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  get hours(): string {
    return this.pad(this.time.getHours());
  }

  get minutes(): string {
    return this.pad(this.time.getMinutes());
  }

  private pad(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }
}
