import { Component, Input } from '@angular/core';
import { DepartureInfo, TrainService, TripInfo } from '../../services/train/train.service';
import { TimetableMarqueeComponent } from '../../ui/timetable-marquee/timetable-marquee.component';

@Component({
  selector: 'app-timetable-entry',
  standalone: true,
  imports: [TimetableMarqueeComponent],
  templateUrl: './timetable-entry.component.html',
  styleUrl: './timetable-entry.component.scss'
})
export class TimetableEntryComponent {
  @Input() trainEntry!: DepartureInfo;
  private tripInfo!: TripInfo;

  plannedTime: string = '';
  actualTime: string = '';

  constructor(private trainService: TrainService) { }

  get viaStops() {
    return this.tripInfo ? this.tripInfo.stopovers.map(stopover => stopover.stop.name).join(' — ') : ''
  }

  get remarks() {
    return this.trainEntry.remarks.map(r => r.text).join(" +++ ")
  }

  ngOnInit(): void {
    if (this.trainEntry) {
      this.plannedTime = this.formatTime(this.trainEntry.plannedWhen);
      this.actualTime = this.formatTime(this.trainEntry.when);
    }

    this.fetchTripInfo();
  }

  private fetchTripInfo(): void {
    this.trainService.getTrip(this.trainEntry.tripId, this.trainEntry.line.name).subscribe({
      next: data => {
        this.tripInfo = data;
      },
      error: () => {
        alert(`Fehler beim Abruf des Zuges ${this.trainEntry.line.name}`)
      }
    })
  }

  private formatTime(dateTimeString: string): string {
    const date = new Date(dateTimeString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
}
