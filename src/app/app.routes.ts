import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'timetable',
    loadChildren: () => import('./timetable/timetable.routes').then(m => m.TimetableRoutes)
  }
];
