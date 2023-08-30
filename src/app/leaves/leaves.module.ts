import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeavesRoutingModule } from './leaves-routing.module';
import { LeavesOutletComponent } from './leaves-outlet/leaves-outlet.component';
import { LeaveListComponent } from './leave-list/leave-list.component';
import { ApplyLeaveComponent } from './apply-leave/apply-leave.component';
import { LeaveRequestComponent } from './leave-request/leave-request.component';
import { ReactiveFormsModule } from '@angular/forms';


import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [
    LeavesOutletComponent,
    LeaveListComponent,
    ApplyLeaveComponent,
    LeaveRequestComponent
  ],
  imports: [
    CommonModule,
    LeavesRoutingModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatOptionModule,
    MatSelectModule
  ]
})
export class LeavesModule { }
