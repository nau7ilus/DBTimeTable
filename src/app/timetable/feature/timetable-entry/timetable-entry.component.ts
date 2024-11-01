import { NgClass } from '@angular/common';
import {
  Component,
  ComponentRef,
  Input,
  OnDestroy,
  OnInit,
  ViewContainerRef,
} from '@angular/core';
import * as L from 'leaflet';
import {
  interval,
  Observable,
  startWith,
  Subscription,
  switchMap,
  tap,
} from 'rxjs';
import { TrainModalComponent } from '../../feature/train-modal/train-modal.component';
import {
  DepartureInfo,
  TrainService,
  TripInfo,
} from '../../services/train/train.service';
import { TimetableMarqueeComponent } from '../../ui/timetable-marquee/timetable-marquee.component';

type RecentPosition = {
  timestamp: number;
  pos: L.LatLng;
};

@Component({
  selector: 'app-timetable-entry',
  standalone: true,
  imports: [TimetableMarqueeComponent, NgClass, TrainModalComponent],
  templateUrl: './timetable-entry.component.html',
  styleUrl: './timetable-entry.component.scss',
})
export class TimetableEntryComponent implements OnDestroy, OnInit {
  @Input() trainEntry!: DepartureInfo;
  @Input() stationId!: string;
  private subscription!: Subscription;
  tripInfo!: TripInfo;

  arrivalDatestring!: string;
  arrivalTime: number = 0;

  lastLocationPoint = L.latLng(0, 0);
  lastUpdate: number = 0;
  currentSpeed: number = 0;

  plannedTime: string = '';
  actualTime: string = '';
  modal!: ComponentRef<TrainModalComponent> | null;

  constructor(
    private trainService: TrainService,
    private viewContainerRef: ViewContainerRef
  ) { }

  get viaStops() {
    if (!this.tripInfo) return '';

    const currentStationIndex = this.tripInfo.stopovers.findIndex(
      (s) => s.stop.id === this.stationId
    );

    const stopovers = this.tripInfo.stopovers.filter(
      (so, index) =>
        (so.stop.products.regionalExp || so.stop.products.nationalExpress) &&
        index > currentStationIndex
    );
    return stopovers.map((s) => s.stop.name).join(' — ');
  }

  get remarks() {
    return this.trainEntry.remarks.map((r) => r.text).join(' +++ ');
  }

  // TODO: Nicht möglich zu bestimmen, weil API absurde Daten schickt
  get hasArrived() {
    if (!this.tripInfo?.arrival) return false;
    if (this.arrivalDatestring !== this.tripInfo.arrival) {
      this.arrivalDatestring = this.tripInfo.arrival;
      this.arrivalTime = new Date(this.arrivalDatestring).getTime();
    }
    return Date.now() - this.arrivalTime > 0;
  }

  ngOnInit(): void {
    if (this.trainEntry) {
      this.plannedTime = TrainService.formatTime(this.trainEntry.plannedWhen);
      this.actualTime = TrainService.formatTime(this.trainEntry.when);
      this.updateTripInfo().subscribe();
    }
  }

  private calculateSpeed(currentPos: L.LatLng, currentTimestamp: number): void {
    const distanceMeters = this.lastLocationPoint.distanceTo(currentPos);
    const timeDiffSeconds = currentTimestamp - this.lastUpdate;
    if (timeDiffSeconds > 0) {
      const speedMetersPerSecond = distanceMeters / timeDiffSeconds;
      const speedKmPerHour = speedMetersPerSecond * 3.6;
      this.currentSpeed = speedKmPerHour;
      if (this.modal) this.modal.instance.currentSpeed = this.currentSpeed
    }
  }

  private updateTripInfo(): Observable<TripInfo> {
    return this.trainService
      .getTrip(this.trainEntry.tripId, this.trainEntry.line.name)
      .pipe(
        tap({
          next: (data: TripInfo) => {
            this.tripInfo = data;
            const currentLocation = this.tripInfo?.currentLocation;
            const updateTime = this.tripInfo.realtimeDataUpdatedAt;
            if (currentLocation && this.lastUpdate !== updateTime) {
              const newLocationPoint = L.latLng(
                currentLocation.latitude,
                currentLocation.longitude
              );
              this.calculateSpeed(newLocationPoint, updateTime)
              this.lastLocationPoint = newLocationPoint;
              this.lastUpdate = this.tripInfo.realtimeDataUpdatedAt
            }
            this.lastUpdate = updateTime
          },
          error: () =>
            alert(`Fehler beim Abruf des Zuges ${this.trainEntry.line.name}`),
        })
      );
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  openModal(): void {
    const componentRef =
      this.viewContainerRef.createComponent(TrainModalComponent);
    this.modal = componentRef;

    componentRef.instance.trip = this.tripInfo;
    componentRef.instance.isOpened = true;
    componentRef.instance.currentSpeed = this.currentSpeed;

    componentRef.instance.closeModal = () => {
      componentRef.destroy();
      this.subscription.unsubscribe();
      this.modal = null;
    };

    this.subscription = interval(10 * 1000)
      .pipe(
        startWith(0),
        switchMap(() => this.updateTripInfo())
      )
      .subscribe();
  }
}
