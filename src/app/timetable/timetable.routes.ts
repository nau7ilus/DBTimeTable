import { Routes } from '@angular/router';

export const TimetableRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./ui/timetable/timetable.component').then((x) => x.TimetableComponent),
  }
];
