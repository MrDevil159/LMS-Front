import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeavesOutletComponent } from './leaves-outlet/leaves-outlet.component';

const routes: Routes = [
  { path: '', component: LeavesOutletComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeavesRoutingModule { }
