import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeavesRoutingModule } from './leaves-routing.module';
import { LeavesOutletComponent } from './leaves-outlet/leaves-outlet.component';


@NgModule({
  declarations: [
    LeavesOutletComponent
  ],
  imports: [
    CommonModule,
    LeavesRoutingModule
  ]
})
export class LeavesModule { }
