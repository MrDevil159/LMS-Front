// import { inject } from '@angular/core';
// import { CanActivateFn, Router } from '@angular/router';
// import { AuthService } from '../services/auth.service';
// import { map } from 'rxjs/operators';
// import { Observable } from 'rxjs';

// export const isAuthenticatedGuard: CanActivateFn = (route, state): Observable<boolean> => {
//   const authService = inject(AuthService);
//   const router = inject(Router);

//   return authService.isAuthenticatedGuardCheck().pipe(
//     map(isAuthenticated => {
//       if (isAuthenticated) {
//         return true;
//       } else {
//         router.navigate(['/auth/login']); 
//         return false;
//       }
//     })
//   );
// };


import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

export const isAuthenticatedGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  try {
    const isLoggedIn = await authService.IsLoggedInGuard();
    
    return isLoggedIn; 
  } catch (error) {
    router.navigate(['/auth/login']); 
    return false; // Handle any errors here.
  }
};

