import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { isAdminGuard } from './shared/guards/is-admin.guard';
import { isAuthenticatedGuard } from './shared/guards/is-authenticated.guard';
import { LandingComponent } from './landing/landing.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: 'leaves',
    loadChildren: () => import('./leaves/leaves.module').then(m => m.LeavesModule),
    canActivate: [isAuthenticatedGuard]

  },
  {
    path: 'users',
    loadChildren: () => import('./user/user.module').then(m => m.UserModule),
    canActivate: [isAuthenticatedGuard,isAdminGuard]
  },
  {
    path: 'holidays',
    loadChildren: () => import('./holidays/holidays.module').then(m => m.HolidaysModule),
    canActivate: [isAuthenticatedGuard,isAdminGuard]
  }, 
  {
    path: '**',
    component: LandingComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
