import { Component, ViewEncapsulation } from '@angular/core';
import { TimetableHeaderComponent } from '../timetable-header/timetable-header.component';


@Component({
  selector: 'app-timetable',
  standalone: true,
  imports: [TimetableHeaderComponent],
  templateUrl: './timetable.component.html',
  styleUrl: './timetable.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class TimetableComponent {
}
