import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserAddFormComponent } from './user-add-form/user-add-form.component';
import { UserListComponent } from './user-list/user-list.component';

const routes: Routes = [
  {
    path: '',
    component: UserListComponent,
  },
  {
    path: 'add',
    component: UserAddFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
