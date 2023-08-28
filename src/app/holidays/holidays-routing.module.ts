import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HolidayOutletComponent } from './holiday-outlet/holiday-outlet.component';
import { HolidayFormComponent } from './holiday-form/holiday-form.component';
import { CalendarComponent } from './calendar/calendar.component';

const routes: Routes = [
  {
    path: '',
    component: HolidayOutletComponent,
    children: [
      {
        path: '',
        component: CalendarComponent
      },
      {
        path: 'edit',
        component: HolidayFormComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HolidaysRoutingModule {}
