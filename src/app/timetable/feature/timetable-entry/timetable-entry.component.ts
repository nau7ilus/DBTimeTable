import { Component, Input } from '@angular/core';
import { TrainInfo } from '../../services/train/train.codec';
import { TimetableMarqueeComponent } from '../../ui/timetable-marquee/timetable-marquee.component';

@Component({
  selector: 'app-timetable-entry',
  standalone: true,
  imports: [TimetableMarqueeComponent],
  templateUrl: './timetable-entry.component.html',
  styleUrl: './timetable-entry.component.scss'
})
export class TimetableEntryComponent {
  @Input() trainEntry!: TrainInfo;

  plannedTime: string = '';
  actualTime: string = '';

  ngOnInit(): void {
    if (this.trainEntry) {
      this.plannedTime = this.formatTime(this.trainEntry.plannedWhen);
      this.actualTime = this.formatTime(this.trainEntry.when);
    }
  }

  private formatTime(dateTimeString: string): string {
    const date = new Date(dateTimeString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
}
