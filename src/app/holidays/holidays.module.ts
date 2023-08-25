import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HolidaysRoutingModule } from './holidays-routing.module';
import { HolidayFormComponent } from './holiday-form/holiday-form.component';


@NgModule({
  declarations: [
    HolidayFormComponent
  ],
  imports: [
    CommonModule,
    HolidaysRoutingModule
  ]
})
export class HolidaysModule { }
