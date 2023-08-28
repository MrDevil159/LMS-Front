import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { Auth, getAuth, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail } from '@angular/fire/auth';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userAuthSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );
  private userDataSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  private firebaseApiUrl =
    'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAEm2MUVk8T3sfzqvSrTFAjr9LCAeQ4hFs';

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  private authenticate: Auth = inject(Auth);

  showErrorSnackbar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      // panelClass: 'error-snackbar',
    });
  }


  get userAuth$(): Observable<any> {
    return this.userAuthSubject.asObservable();
  }
  get userData$(): Observable<any> {
    return this.userDataSubject.asObservable();
  }

  signIn(email: string, password: string): Observable<any> {
    const authfb = getAuth();
    signInWithEmailAndPassword(authfb, email, password).then(
      (userLoginResponse)=> {
        console.log('comes from auth fb');
        console.log(userLoginResponse);
        if(userLoginResponse.user.emailVerified === false) {
          sendEmailVerification(authfb.currentUser!).then(
            ()=> {
              console.log('email sent');
              
            }
          );
        }
      }
    ).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);      
    });


    const body = {
      email,
      password,
      returnSecureToken: true,
    };
    return this.http.post(this.firebaseApiUrl, body).pipe(
      tap((response) => {
        this.userAuthSubject.next(response);
      }),
      catchError((error) => {
        return throwError(() => this.mapFirebaseErrorToMessage(error)); // Handle error here
      })
    );
  }

  private mapFirebaseErrorToMessage(error: any): string {
    if (error && error.error && error.error.error) {
      const firebaseError = error.error.error.message;
      switch (firebaseError) {
        case 'EMAIL_NOT_FOUND':
          return 'Email not found.';
        case 'INVALID_PASSWORD':
          return 'Invalid password.';
        default:
          return 'An error occurred during login. Please try again.';
      }
    } else {
      return 'An error occurred during login. Please try again.';
    }
  }

  fetchUserDataByEmail(email: string | null): Observable<string | null> {
    const databaseUrl = `https://leavemanagementlinkzy-default-rtdb.asia-southeast1.firebasedatabase.app/users.json?orderBy="email"&equalTo="${email}"`;
    return this.http.get<any>(databaseUrl).pipe(
      tap((response) => {
        if (response) {
          const userIds = Object.keys(response);
          if (userIds.length > 0) {
            const firstUserId = userIds[0];
            this.userDataSubject.next(response[firstUserId]);
          }
        }
        console.log("User Data");
        console.log(this.userDataSubject.value);
      }),
      catchError((error) => {
        console.error('Error fetching user role:', error);
        return throwError(() =>
          console.log('Error fetching user role.', error)
        );
      })
    );
  }

  insertUserData(userData:any): Observable<any> {
    const databaseUrl =
      'https://leavemanagementlinkzy-default-rtdb.asia-southeast1.firebasedatabase.app/users.json';
    return this.http.post(databaseUrl, userData).pipe(
      tap((response) => {
        console.log('User data inserted:', response);
      }),
      catchError((error) => {
        console.error('Error inserting user data:', error);
        return throwError(() =>
          console.log('Error inserting user data.', error)
        );
      })
    );
  }

  isAuthenticated(): boolean {
    const userToken = this.userAuthSubject.value?.idToken;
    return !!userToken;
  }

  isAdmin(): boolean {
    const userRole = this.userDataSubject.value?.role;
    return userRole === 'ADMIN';
  }

  forgotPassword(email: string): void {
    const auth = getAuth();
    sendPasswordResetEmail(auth, email)
      .then(() => {
        console.log('reset email sent');
        
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);  
        this.showErrorSnackbar('Please enter email field')
      });
  }
  async isLoggedIn() {
    const authfb = getAuth();
    const user = authfb.currentUser;
    if(user) {
      this.userAuthSubject.next(authfb.currentUser);
      console.log(this.userAuthSubject.value);
      const userValue = await this.fetchUserDataByEmail(authfb.currentUser.email)
      this.userDataSubject.next(userValue);
      console.log(this.userDataSubject.value);

    }
    return !!user;
  }
}
