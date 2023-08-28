import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth.service';
import { BehaviorSubject, Observable, Subject, catchError, tap, throwError } from 'rxjs';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { Auth } from '@angular/fire/auth';
import { getDatabase ,Database, set, ref, update, onValue  } from '@angular/fire/database';
import { Event } from 'src/app/shared/model/Event.model';


@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient, private authService: AuthService, private authen:Auth, private database:Database) { }

  
  private allUserData: Subject<any> = new Subject<any>();

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
          return 'Too many attempts, try later'
        default:
          return 'An error occurred during Registration. Please try again.';
      }
    } else {
      return 'An error occurred during Registration. Please try again.';
    }
  }


  insertUserDataModel(data: any): Observable<any> {
    return this.http.post('https://leavemanagementlinkzy-default-rtdb.asia-southeast1.firebasedatabase.app/users.json', data);
  }

  getAllUserData(): Observable<any> { 
    return this.http.get('https://leavemanagementlinkzy-default-rtdb.asia-southeast1.firebasedatabase.app/users.json');
  }


  enterHolidayData(name: string, date: string, typeOfHoliday:string) {
    const db = getDatabase();
    set(ref(db, 'holidays/' + name), {
      name: name,
      date: date,
      typeOfHoliday : typeOfHoliday
    });
  }

  readHolidayData(name:string) {
    const db = getDatabase();
    const starCountRef = ref(db, 'holidays/' + name);
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      console.log(data);
    });
  }
}
