import { NgClass } from '@angular/common';
import { Component, Input, ViewContainerRef } from '@angular/core';
import { TrainModalComponent } from '../../feature/train-modal/train-modal.component';
import { DepartureInfo, TrainService, TripInfo } from '../../services/train/train.service';
import { TimetableMarqueeComponent } from '../../ui/timetable-marquee/timetable-marquee.component';

@Component({
  selector: 'app-timetable-entry',
  standalone: true,
  imports: [TimetableMarqueeComponent, NgClass, TrainModalComponent],
  templateUrl: './timetable-entry.component.html',
  styleUrl: './timetable-entry.component.scss'
})
export class TimetableEntryComponent {
  @Input() trainEntry!: DepartureInfo;
  tripInfo!: TripInfo;

  plannedTime: string = '';
  actualTime: string = '';

  constructor(private trainService: TrainService,
    private viewContainerRef: ViewContainerRef
  ) { }

  get viaStops() {
    return this.tripInfo ? this.tripInfo.stopovers.filter(stopover => stopover.stop.products.nationalExpress).map(stopover => stopover.stop.name).join(' — ') : ''
  }

  get remarks() {
    return this.trainEntry.remarks.map(r => r.text).join(" +++ ")
  }

  get hasArrived() {
    if (!this.tripInfo?.arrival) return false;
    else return true
    //  const arrivalDate = new Date(this?.tripInfo?.arrival)
    //return Date.now() - arrivalDate.getTime() > 0
  }

  ngOnInit(): void {
    if (this.trainEntry) {
      this.plannedTime = this.formatTime(this.trainEntry.plannedWhen);
      this.actualTime = this.formatTime(this.trainEntry.when);
      this.fetchTripInfo();
    }
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

  openModal(): void {
    const componentRef = this.viewContainerRef.createComponent(TrainModalComponent);

    componentRef.instance.trip = this.tripInfo;
    componentRef.instance.isOpened = true;

    componentRef.instance.closeModal = () => {
      componentRef.destroy()
    }
  }

  private formatTime(dateTimeString: string): string {
    const date = new Date(dateTimeString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
}
