import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TrainModalComponent } from '../../feature/train-modal/train-modal.component';
import { DepartureInfo, TrainService, TripInfo } from '../../services/train/train.service';
import { InnerDrawerComponent } from '../../ui/inner-drawer/inner-drawer.component';
import { TimetableMarqueeComponent } from '../../ui/timetable-marquee/timetable-marquee.component';

@Component({
  selector: 'app-timetable-entry',
  standalone: true,
  imports: [TimetableMarqueeComponent, NgClass, TrainModalComponent, InnerDrawerComponent],
  templateUrl: './timetable-entry.component.html',
  styleUrl: './timetable-entry.component.scss'
})
export class TimetableEntryComponent {
  @Input() trainEntry!: DepartureInfo;
  @Input('modalDialog') modalDialog: any;

  tripInfo!: TripInfo;

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
