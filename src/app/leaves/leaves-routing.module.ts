import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeavesOutletComponent } from './leaves-outlet/leaves-outlet.component';
import { LeaveListComponent } from './leave-list/leave-list.component';
import { LeaveRequestComponent } from './leave-request/leave-request.component';
import { ApplyLeaveComponent } from './apply-leave/apply-leave.component';

const routes: Routes = [
  { path: '', component: LeavesOutletComponent, children: [ 
    {path: '', component: LeaveListComponent},
    {path: 'apply', component: ApplyLeaveComponent },
    {path: 'requests', component: LeaveRequestComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeavesRoutingModule { }
