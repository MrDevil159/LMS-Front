import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HolidayOutletComponent } from './holiday-outlet/holiday-outlet.component';
import { HolidayFormComponent } from './holiday-form/holiday-form.component';
import { CalendarComponent } from './calendar/calendar.component';
import { TableViewComponent } from './table-view/table-view.component';

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
      {
        path: 'list',
        component: TableViewComponent
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HolidaysRoutingModule {}
