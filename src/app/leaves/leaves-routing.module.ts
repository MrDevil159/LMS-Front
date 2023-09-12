import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeavesOutletComponent } from './leaves-outlet/leaves-outlet.component';
import { LeaveListComponent } from './leave-list/leave-list.component';
import { LeaveRequestComponent } from './leave-request/leave-request.component';
import { ApplyLeaveComponent } from './apply-leave/apply-leave.component';
import { isAuthenticatedGuard } from '../shared/guards/is-authenticated.guard';
import { isAdminGuard } from '../shared/guards/is-admin.guard';

const routes: Routes = [
  { path: '', component: LeavesOutletComponent, children: [ 
    {path: '', component: LeaveListComponent},
    {path: 'apply', component: ApplyLeaveComponent },
    {path: 'requests', component: LeaveRequestComponent, canActivate: [isAuthenticatedGuard,isAdminGuard]}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeavesRoutingModule { }
