import { Component } from '@angular/core';
import { TimetableMarqueeComponent } from '../../ui/timetable-marquee/timetable-marquee.component';

@Component({
  selector: 'app-timetable-entry',
  standalone: true,
  imports: [TimetableMarqueeComponent],
  templateUrl: './timetable-entry.component.html',
  styleUrl: './timetable-entry.component.scss'
})
export class TimetableEntryComponent {

}
