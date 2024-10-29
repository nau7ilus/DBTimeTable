import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { TimetableClockComponent } from '../../feature/timetable-clock/timetable-clock.component';
import { TimetableEntryComponent } from '../../feature/timetable-entry/timetable-entry.component';
import { TrainInfo, TrainService } from '../../services/train/train.service';
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
  trainData: TrainInfo[] = [];
  private subscription!: Subscription;

  constructor(private trainService: TrainService) { }

  ngOnInit(): void {
    this.subscription = interval(3000)
      .pipe(switchMap(() => this.trainService.getTrainData('8012666')))
      .subscribe({
        next: (data) => {
          console.log(data)
          this.trainData = data;
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
