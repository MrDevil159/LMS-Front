import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, Observer, firstValueFrom, from, throwError, of } from 'rxjs';
import { catchError, first, tap } from 'rxjs/operators';
import {
  Auth,
  getAuth,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  idToken,
} from '@angular/fire/auth';
import { getDatabase, ref, onValue } from "firebase/database";

import { MatSnackBar } from '@angular/material/snack-bar';
import { Database, set } from '@angular/fire/database';
import { Router } from '@angular/router';
import { NavigationService } from './navigation.service';

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
  authfb!: Auth;
  constructor(private http: HttpClient, private snackBar: MatSnackBar, private database:Database) {
    this.authfb = getAuth();
  }

  private authenticate: Auth = inject(Auth);

  showErrorSnackbar(message: string, duration: number): void {
    this.snackBar.open(message, 'Close', {
      duration: duration,
      // panelClass: 'error-snackbar',
    });
  }

  get userAuth$(): Observable<any> {
    return this.userAuthSubject.asObservable();
  }
  get userData$(): Observable<any> {
    return this.userDataSubject.asObservable();
  }

  signIn(email: string, password: string): Promise<any> {
    const authfb = getAuth();
    signInWithEmailAndPassword(authfb, email, password)
      .then((userLoginResponse) => {
        console.log('comes from auth fb');
        console.log(userLoginResponse);
        this.userAuthSubject.next(userLoginResponse);
        if (userLoginResponse.user.emailVerified === false) {
          sendEmailVerification(authfb.currentUser!).then(() => {
            console.log('email sent');
          });
        }
      })
      .catch((error) => {
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
    return this.http.post(this.firebaseApiUrl, body).toPromise();
  }


  fetchUserDataByEmail(email: string | null): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!email) {
        reject('Email is null');
        return;
      }
      const db = getDatabase();
      const queryRef = ref(db, 'users/');
      onValue(queryRef, (snapshot) => {
        const data = snapshot.toJSON();

        const filteredObject = Object.values(data!).find(item => item.email === email);

        if (filteredObject) {
          this.userDataSubject.next(filteredObject);
          resolve(filteredObject);
        } else {
          reject('Invalid');
        }
      });
    });
  }
  


  insertUserData(userData: any): Observable<any> {
    return from(this.enterUserData(userData)).pipe(
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

  async enterUserData(userData: any) {
    const db = getDatabase();
    try {
      await set(ref(db, 'users/' + userData.email), userData);
    } catch (error) {
      throw error;
    }
  }

  isAuthenticatedGuardCheck(): Observable<boolean> {
    return new Observable<boolean>((observer: Observer<boolean>) => {
      const userDate = this.authfb.currentUser;
      if (userDate) {
        observer.next(true);
        observer.complete();
      } else {
        observer.next(false);
        observer.complete();
      }
    });
  }
  isAuthenticated(): boolean {
    const auth = getAuth();

    const userToken = this.authfb.currentUser;
    return !!userToken;
  }

  isAdminGuardCheck(): Promise<boolean> {
    return new Promise(async (resolve) => {
      try {
        // Wait for the userDataSubject to emit a value
        const userData = await firstValueFrom(this.userDataSubject);
        
        // Check the user role and resolve the promise accordingly
        if (userData?.role === 'ADMIN') {
          resolve(true);
        } else {
          resolve(false);
        }
      } catch (error) {
        // Handle any errors here
        console.error('Error checking admin status:', error);
        resolve(false); // You can handle this case as needed
      }
    });
  }
  
  
  isAdmin():Boolean {
    console.log();
    
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
        this.showErrorSnackbar(errorMessage, 5000);
      });
  }
  router = inject(Router);
  isLoggedIn() {
    console.log('checking');
    this.authfb.onAuthStateChanged((res) => {
      console.log(res);
      const user = this.authfb.currentUser;
      if (user) {
        const userDataPromise = this.fetchUserDataByEmail(user.email);
        userDataPromise.then((data) => {
          this.userAuthSubject.next(this.authfb.currentUser);
          console.log(this.userAuthSubject.value);
          console.log(data);
          if(data.role === 'USER') {
            this.router.navigate(['/leaves']);
          } else if(data.role === 'ADMIN') {
            this.router.navigate(['leaves', 'requests']);
          }
        });
      }
    });
    // return !!user;
  }


  userIdToken(): string {
    const idTokenPromise = this.userAuthSubject.value.accessToken;
    return idTokenPromise;
  }
  
  

  logout() {
    this.authfb.signOut();
    this.userAuthSubject.next(null);
    this.userDataSubject.next(null);
  }



}
