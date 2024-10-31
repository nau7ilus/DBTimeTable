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
  @Input() stationId!: string;
  tripInfo!: TripInfo;

  arrivalDatestring!: string;
  arrivalTime: number = 0;

  plannedTime: string = '';
  actualTime: string = '';

  constructor(private trainService: TrainService,
    private viewContainerRef: ViewContainerRef
  ) { }

  get viaStops() {
    if (!this.tripInfo) return ''

    const currentStationIndex = this.tripInfo.stopovers.findIndex(s => s.stop.id === this.stationId)

    const stopovers = this.tripInfo.stopovers.filter((so, index) => (so.stop.products.regionalExp || so.stop.products.nationalExpress) && index > currentStationIndex)
    return stopovers.map(s => s.stop.name).join(' — ')
  }

  get remarks() {
    return this.trainEntry.remarks.map(r => r.text).join(" +++ ")
  }

  // TODO: Nicht möglich zu bestimmen, weil API absurde Daten schickt
  get hasArrived() {
    if (!this.tripInfo?.arrival) return false;
    if (this.arrivalDatestring !== this.tripInfo.arrival) {
      this.arrivalDatestring = this.tripInfo.arrival;
      this.arrivalTime = new Date(this.arrivalDatestring).getTime()
    }
    return Date.now() - this.arrivalTime > 0
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
