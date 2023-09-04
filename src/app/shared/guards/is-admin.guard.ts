import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const isAdminGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  try {
    const isAdmin = await authService.isAdminGuardCheck();
    if (isAdmin) {
      return true; 
    } else {
      router.navigate(['/leaves']); 
      return false;
    }
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false; 
  }
};
