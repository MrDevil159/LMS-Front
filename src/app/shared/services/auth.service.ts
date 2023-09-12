import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, Observer, firstValueFrom, from, throwError, of, Subscription } from 'rxjs';
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
        this.showErrorSnackbar(this.getErrorMessageFromCode(errorCode), 5000);

      });
    const body = {
      email,
      password,
      returnSecureToken: true,
    };
    return this.http.post(this.firebaseApiUrl, body).toPromise();
  }

  getErrorMessageFromCode(errorCode: string): string {
    switch (errorCode) {
      case 'auth/claims-too-large':
        return 'Claims payload too large.';
      case 'auth/email-already-exists':
        return 'Email is already in use.';
      case 'auth/id-token-expired':
        return 'ID token expired.';
      case 'auth/id-token-revoked':
        return 'ID token revoked.';
      case 'auth/insufficient-permission':
        return 'Insufficient permission.';
      case 'auth/internal-error':
        return 'Internal server error.';
      case 'auth/invalid-argument':
        return 'Invalid argument.';
      case 'auth/invalid-claims':
        return 'Invalid custom claims.';
      case 'auth/invalid-continue-uri':
        return 'Invalid continue URL.';
      case 'auth/invalid-creation-time':
        return 'Invalid creation time.';
      case 'auth/invalid-credential':
        return 'Invalid credential.';
      case 'auth/invalid-disabled-field':
        return 'Invalid disabled property.';
      case 'auth/invalid-display-name':
        return 'Invalid display name.';
      case 'auth/invalid-dynamic-link-domain':
        return 'Invalid dynamic link domain.';
      case 'auth/invalid-email':
        return 'Invalid email address.';
      case 'auth/invalid-email-verified':
        return 'Invalid email verified property.';
      case 'auth/invalid-hash-algorithm':
        return 'Invalid hash algorithm.';
      case 'auth/invalid-hash-block-size':
        return 'Invalid hash block size.';
      case 'auth/invalid-hash-derived-key-length':
        return 'Invalid hash key length.';
      case 'auth/invalid-hash-key':
        return 'Invalid hash key.';
      case 'auth/invalid-hash-memory-cost':
        return 'Invalid hash memory cost.';
      case 'auth/invalid-hash-parallelization':
        return 'Invalid hash parallelization.';
      case 'auth/invalid-hash-rounds':
        return 'Invalid hash rounds.';
      case 'auth/invalid-hash-salt-separator':
        return 'Invalid hash salt separator.';
      case 'auth/invalid-id-token':
        return 'Invalid ID token.';
      case 'auth/invalid-last-sign-in-time':
        return 'Invalid last sign-in time.';
      case 'auth/invalid-page-token':
        return 'Invalid page token.';
      case 'auth/invalid-password':
        return 'Invalid password.';
      case 'auth/invalid-password-hash':
        return 'Invalid password hash.';
      case 'auth/invalid-password-salt':
        return 'Invalid password salt.';
      case 'auth/invalid-phone-number':
        return 'Invalid phone number.';
      case 'auth/invalid-photo-url':
        return 'Invalid photo URL.';
      case 'auth/invalid-provider-data':
        return 'Invalid provider data.';
      case 'auth/invalid-provider-id':
        return 'Invalid provider ID.';
      case 'auth/invalid-oauth-responsetype':
        return 'Invalid OAuth responseType.';
      case 'auth/invalid-session-cookie-duration':
        return 'Invalid session cookie duration.';
      case 'auth/invalid-uid':
        return 'Invalid user ID.';
      case 'auth/invalid-user-import':
        return 'Invalid user record import.';
      case 'auth/maximum-user-count-exceeded':
        return 'Maximum user count exceeded.';
      case 'auth/missing-android-pkg-name':
        return 'Missing Android Package Name.';
      case 'auth/missing-continue-uri':
        return 'Missing continue URL.';
      case 'auth/missing-hash-algorithm':
        return 'Missing hash algorithm.';
      case 'auth/missing-ios-bundle-id':
        return 'Missing iOS Bundle ID.';
      case 'auth/missing-uid':
        return 'Missing user ID.';
      case 'auth/missing-oauth-client-secret':
        return 'Missing OAuth client secret.';
      case 'auth/operation-not-allowed':
        return 'Operation not allowed.';
      case 'auth/phone-number-already-exists':
        return 'Phone number already in use.';
      case 'auth/project-not-found':
        return 'Project not found.';
      case 'auth/reserved-claims':
        return 'Reserved custom claims.';
      case 'auth/session-cookie-expired':
        return 'Session cookie expired.';
      case 'auth/session-cookie-revoked':
        return 'Session cookie revoked.';
      case 'auth/too-many-requests':
        return 'Too many requests.';
      case 'auth/uid-already-exists':
        return 'User ID already in use.';
      case 'auth/unauthorized-continue-uri':
        return 'Unauthorized continue URL.';
      case 'auth/user-not-found':
        return 'User not found.';
      case 'auth/missing-password':
        return 'Password field is missing.';
      case 'auth/wrong-password':
        return 'Invalid Credentials.';
      default:
        return 'An error occurred. Please try again later.';
    }
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
  async IsLoggedInGuard(): Promise<boolean> {
    try {
      return await new Promise((resolve, reject) =>
        this.authfb.onAuthStateChanged(
          user => {
            if (user) {
              resolve(true); 
            } else {
              resolve(false); 
            }
          },
          error => reject(error)
        )
      );
    } catch (error) {
      return false; 
    }
  }
  
  isAdminGuardCheck(): Promise<boolean> {
    return new Promise(async (resolve) => {
      let userDataSubscription: Subscription | null = null; // Initialize to null
      
      try {
        userDataSubscription = this.userDataSubject.subscribe(async (userData) => {
          try {
            // Check the user role and resolve the promise accordingly
            console.log(userData);
            
            if (userData?.role === 'ADMIN') {
              console.log('is Admin');
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
      } catch (error) {
        // Handle any errors here
        console.error('Error subscribing to userDataSubject:', error);
        resolve(false); // You can handle this case as needed
      } finally {
        // Check if userDataSubscription is not null before attempting to unsubscribe
        if (userDataSubscription) {
          userDataSubscription.unsubscribe();
        }
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
        });
      }
    });
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
