import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { getAuth } from '@angular/fire/auth';

export const isAdminGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const authfb = getAuth();

  return new Promise<boolean>((resolve) => {
    authfb.onAuthStateChanged(async (user) => {
      console.log(user?.email);

      if (user) {
        try {
          const userData = await authService.fetchUserDataByEmail(user.email);

          if (userData && userData.role === 'ADMIN') {
            console.log('User is an admin');
            resolve(true);
          } else {
            console.log('User is not an admin');
            resolve(router.navigate(['leaves']));
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          resolve(router.navigate(['auth']));
        }
      } else {
        resolve(router.navigate(['auth']));
      }
    });
  });
};
