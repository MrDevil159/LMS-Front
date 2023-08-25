import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  constructor(public authService: AuthService, private router: Router) {}
  error:null|string = null;
  onSignIn(email: string, password: string) {
    this.authService.signIn(email, password).subscribe({
      next: (data: any) => {
        console.log('Signning In....');
        this.authService.fetchUserDataByEmail(email).subscribe({
          next: (data: any) => {
            console.log('Fetching Auth Data...');
            if (this.authService.isAdmin()) {
              this.router.navigate(['/users']);
            } else {
              this.router.navigate(['/leaves']);
            }
          },
          error: (error: any) => {
            this.authService.showErrorSnackbar(error);
            console.log(error);
            this.error = error;
          },
        });
      },
      error: (error) => {
        console.log(error);
        this.error = error;
        this.authService.showErrorSnackbar(error);

      },
      complete: () => {
        console.log('login process finished');
      },
    });
  }
  onForgotPassword(email:string) {
    console.log(email.trim().length);
    
    if(email.trim().length == 0) {
      this.authService.showErrorSnackbar('Please enter email field');


    } else {
      this.authService.forgotPassword(email);
    }
  }
  nullError() {
    this.error='';
  }
}
