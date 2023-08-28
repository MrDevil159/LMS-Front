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

@NgModule({
  declarations: [
    HolidayFormComponent,
    CalendarComponent,
    CustomTooltipComponent
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
MatNativeDateModule
    
  ]
})
export class HolidaysModule { }
