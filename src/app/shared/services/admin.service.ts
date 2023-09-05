import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable, Subject, catchError, tap, throwError, from } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';

import { Auth } from '@angular/fire/auth';
import {
  getDatabase,
  Database,
  set,
  ref,
  update,
  onValue,
  remove,
} from '@angular/fire/database';
import { Event } from 'src/app/shared/model/Event.model';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private authen: Auth,
    private database: Database
  ) {
  }

  private allUserData: Subject<any> = new Subject<any>();
  backendUrl = 'https://lms-backend-w91s.onrender.com';
  firebaseApiUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAEm2MUVk8T3sfzqvSrTFAjr9LCAeQ4hFs`;

  registerUser(email: string, password: string) {
    const body = {
      email,
      password,
      returnSecureToken: true,
    };
    return this.http.post(this.firebaseApiUrl, body).pipe(
      tap(() => {
        this.allUserData.next(true);
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
        case 'EMAIL_EXISTS':
          return 'Email Already Exists.';
        case 'OPERATION_NOT_ALLOWED':
          return 'Password sign-in is disabled.';
        case 'TOO_MANY_ATTEMPTS_TRY_LATER':
          return 'Too many attempts, try later';
        default:
          return 'An error occurred during Registration. Please try again.';
      }
    } else {
      return 'An error occurred during Registration. Please try again.';
    }
  }

  insertUserDataModel(data: any): Observable<any> {
    return this.http.post(
      'https://leavemanagementlinkzy-default-rtdb.asia-southeast1.firebasedatabase.app/users.json',
      data
    );
  }

  getAllUserData(): Observable<any[]> {
    return new Observable<any[]>((observer) => {
      const tokenPromise = this.authService.authfb.currentUser?.getIdToken(true);
  
      if (tokenPromise) {
        tokenPromise
          .then((token) => {
            const headers = new HttpHeaders({
              Authorization: `Bearer ${token}`,
            });
  
            this.http
              .get<any[]>(`${this.backendUrl}/users`, { headers })
              .subscribe(
                (data) => {
                  observer.next(data); 
                  observer.complete(); 
                },
                (error) => {
                  console.error('Error getting user data:', error);
                  observer.error(error); 
                }
              );
          })
          .catch((error) => {
            console.error('Error getting token:', error); 
            observer.error(error); 
          });
      } else {
        console.error('Token promise is undefined');
        observer.error('Token promise is undefined'); 
      }
    });
  }
  
  

  getAllHoliday(): Observable<Event[]> {
    const db = getDatabase();
    const starCountRef = ref(db, 'holidays');

    return new Observable<Event[]>((subscriber) => {
      const unsubscribe = onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        const transformedData = Object.values(data).map((item) => ({
          name: (item as Event).name,
          date: (item as Event).date,
          typeOfHoliday: (item as Event).typeOfHoliday,
        }));
        subscriber.next(transformedData);
      });
    });
  }

  enterHolidayData(name: string, date: string, typeOfHoliday: string) {
    const db = getDatabase();
    set(ref(db, 'holidays/' + name), {
      name: name,
      date: date,
      typeOfHoliday: typeOfHoliday,
    });
  }

  editHolidayData(
    nameOld: string,
    name: string,
    date: string,
    typeOfHoliday: string
  ) {
    const db = getDatabase();
    const holidayRef = ref(db, 'holidays/' + nameOld);

    if (holidayRef) {
      remove(holidayRef)
        .then(() => {
          this.enterHolidayData(name, date, typeOfHoliday);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      console.log('Reference does not exist or is invalid.');
    }
  }

  deleteHolidayEvent(event: Event) {
    const db = getDatabase();
    remove(ref(db, 'holidays/' + event.name))
      .then(() => {
        this.authService.showErrorSnackbar('Removed Successfully',5000);
      })
      .catch((err) => {
        console.log(err);
        this.authService.showErrorSnackbar('Removal Failed', 5000);
      });
  }


  deleteUser(id: string, email: string): Observable<any> {
    const tokenPromise = this.authService.authfb.currentUser?.getIdToken(true);
  
    if (tokenPromise) {
      return new Observable((observer) => {
        tokenPromise
          .then((token) => {
            const headers = new HttpHeaders({
              Authorization: `Bearer ${token}`,
            });
  
            this.http
              .delete(`${this.backendUrl}/user/${id}`, { headers })
              .pipe(
                catchError((error) => {
                  console.error('Error deleting user:', error);
                  observer.error(error);
                  return throwError(error);
                })
              )
              .subscribe((result) => {
                this.http
                  .delete(`${this.backendUrl}/userdel/${email}`, { headers })
                  .subscribe(
                    () => {
                      observer.next(result);
                      observer.complete();
                    },
                    (error) => {
                      console.error('Error deleting userdel:', error);
                      observer.error(error);
                    }
                  );
              });
          })
          .catch((error) => {
            console.error('Error getting token:', error);
            observer.error(error);
          });
      });
    } else {
      console.error('Token promise is undefined');
      return throwError('Token promise is undefined');
    }
  }
  
  
  
  editUser(uid: string, update: any): Observable<any> {
    return new Observable((observer) => {
      const tokenPromise = this.authService.authfb.currentUser?.getIdToken(true);
      console.log(update);
      
      if (!tokenPromise) {
        console.error('Token promise is undefined');
        observer.error('Token promise is undefined');
        observer.complete();
        return;
      }
  
      tokenPromise
        .then((token) => {
          const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
          });
  
          this.http
            .post(`${this.backendUrl}/updateUser/${uid}`, { update }, { headers })
            .subscribe(
              (result) => {
                observer.next(result);
                observer.complete();
              },
              (error) => {
                console.error('Error updating user:', error);
                observer.error(error);
                observer.complete();
              }
            );
        })
        .catch((error) => {
          console.error('Error getting token:', error);
          observer.error(error);
          observer.complete();
        });
    });
  }
  
}
