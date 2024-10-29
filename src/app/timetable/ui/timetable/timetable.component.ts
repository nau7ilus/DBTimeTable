import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
import { TimetableClockComponent } from '../../feature/timetable-clock/timetable-clock.component';
import { TimetableEntryComponent } from '../../feature/timetable-entry/timetable-entry.component';
import { DepartureInfo, TrainService } from '../../services/train/train.service';
import { TimetableHeaderComponent } from '../timetable-header/timetable-header.component';

@Component({
  selector: 'app-timetable',
  standalone: true,
  imports: [TimetableHeaderComponent, TimetableClockComponent, TimetableEntryComponent],
  templateUrl: './timetable.component.html',
  styleUrl: './timetable.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class TimetableComponent implements OnInit, OnDestroy {
  trainData: DepartureInfo[] = [];
  private subscription!: Subscription;

  constructor(private trainService: TrainService) { }

  ngOnInit(): void {
    this.subscription = interval(30 * 1000)
      .pipe(startWith(0))
      .pipe(switchMap(() => this.trainService.getDepartures('8012666'))) // Potsdam Hbf
      .subscribe({
        next: (data) => {
          this.trainData = data.sort((a, b) => new Date(a.plannedWhen).getTime() - new Date(b.plannedWhen).getTime());
        },
        error: (error) => {
          alert('Fehler beim Datenabruf');
          console.error('Fehler beim Datenabruf:', error);
        }
      });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
