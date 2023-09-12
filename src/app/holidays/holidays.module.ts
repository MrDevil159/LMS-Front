import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HolidaysRoutingModule } from './holidays-routing.module';
import { HolidayFormComponent } from './holiday-form/holiday-form.component';
import { CalendarComponent } from './calendar/calendar.component';
import {MatButtonModule} from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CustomTooltipComponent } from './custom-tooltip/custom-tooltip.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import { TableViewComponent } from './table-view/table-view.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';

import { MatSortModule } from '@angular/material/sort';

@NgModule({
  declarations: [
    HolidayFormComponent,
    CalendarComponent,
    CustomTooltipComponent,
    TableViewComponent
  ],
  imports: [
    CommonModule,
    HolidaysRoutingModule,
    MatButtonModule,
    MatTooltipModule,
    ReactiveFormsModule,
    MatSelectModule,
MatButtonModule,
MatInputModule,
MatFormFieldModule,
MatIconModule,
MatDatepickerModule,
MatNativeDateModule,
MatTableModule,
MatPaginatorModule,    
MatSortModule
  ]
})
export class HolidaysModule { }
