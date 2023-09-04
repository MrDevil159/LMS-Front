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
  hide = true;

  onSignIn(email: string, password: string) {
    const promise = this.authService.signIn(email, password);
    promise.then((data: any) => {
      console.log('Signning In....');
      const userDataPromise = this.authService.fetchUserDataByEmail(email);
      userDataPromise.then((data: any) => {
        console.log('Fetching Auth Data...');
        if (this.authService.isAdmin()) {
          this.router.navigate(['/leaves']);
        } else {
          this.router.navigate(['/leaves']);
        }
      });
    }).catch((error: any) => {
      console.log(error);
      this.error = error;
      this.authService.showErrorSnackbar(error);

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
