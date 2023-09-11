import { Injectable } from '@angular/core';
import { getDatabase, ref, onValue } from 'firebase/database';
import {
  Database,
  push,
  query,
  set,
  equalTo,
  orderByChild,
  get,
  remove,
  update,
} from '@angular/fire/database';
import { BehaviorSubject, Observable, Observer, Subject, catchError, from, tap, throwError } from 'rxjs';
import { LeaveModel } from '../model/LeaveRequest.model';
import { Auth, getAuth } from '@angular/fire/auth';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class LeavesService {
  authfb!: Auth;

  private listenerDb = new Subject();

  get listenerDb$() {
    return this.listenerDb.asObservable();
  }
  
  constructor(private database: Database, private authService: AuthService) {
    this.authfb = getAuth();
  }

  insertLeave(leave: LeaveModel): Observable<any> {
    return from(this.enterLeaveData(leave)).pipe(
      tap((response) => {
        console.log('Leave Entry Successful:', response);
      }),
      catchError((error) => {
        console.error(error);
        return throwError(() =>
          console.log('Error inserting Leave Data.', error)
        );
      })
    );
  }

  async enterLeaveData(leave: LeaveModel) {
    const db = getDatabase();
    try {
      const leaves = { ...leave, email: this.authfb.currentUser?.email };
      console.log(leaves);
      await set(push(ref(db, 'leaves/')), leaves);
    } catch (error) {
      throw error;
    }
  }

  getMyLeaves(): Observable<LeaveModel[]> {
    return new Observable<LeaveModel[]>((observer: Observer<LeaveModel[]>) => {
      const db = getDatabase();
      let interval: any;
      const fetchLeaves = (email: string) => {
        const leavesRef = ref(db, 'leaves/');
        const leavesQuery = query(
          leavesRef,
          orderByChild('email'),
          equalTo(email)
        );
        onValue(leavesQuery, (snapshot) => {
          const leaves: LeaveModel[] = [];
          if (snapshot.exists()) {
            snapshot.forEach((leaveSnapshot) => {
              const leave = leaveSnapshot.val() as LeaveModel;
              leaves.push({ ...leave, key: leaveSnapshot.key });
            });
            observer.next(leaves);
          }
          observer.complete();
        });
      };
      const email = this.authfb.currentUser?.email;
      if (email) {
        fetchLeaves(email);
      } else {
        const interval = setInterval(() => {
          const newEmail = this.authfb.currentUser?.email;
          if (newEmail) {
            clearInterval(interval);
            fetchLeaves(newEmail);
          }
        }, 500);
      }

      return () => {
        if (!email) {
          clearInterval(interval);
          observer.error('User email not available.');
          observer.complete();
        }
      };
    });
  }

  editLeave(leave: LeaveModel, refId: string): Observable<any> {
    return from(this.editLeaveData(leave, refId)).pipe(
      tap((response) => {
        console.log('Leave Edit Successful:', response);
      }),
      catchError((error) => {
        console.error(error);
        return throwError(() =>
          console.log('Error Editing Leave Data.', error)
        );
      })
    );
  }

  async editLeaveData(leave: LeaveModel, refId: string) {
    const db = getDatabase();
    try {
      console.log(leave);
      await set(ref(db, 'leaves/' + refId), leave);
      this.authService.showErrorSnackbar('Editing Leave Request Successful', 5000);
    } catch (error) {
      throw error;
    }
  }

  deleteLeave(refId: string) {
    try {
      const db = getDatabase();
      const reference = ref(db, 'leaves/' + refId);
      return remove(reference);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  private currentLeaves: LeaveModel[] = [];

  getAllLeavesNew(status:string): Observable<LeaveModel[]> {
    const db = getDatabase();
    const leavesRef = ref(db, 'leaves');
    const leavesQuery = query(
      leavesRef,
      orderByChild('status'),
      equalTo(status)
    );
    return new Observable<LeaveModel[]>((subscriber) => {
      onValue(leavesQuery, (snapshot) => {
        const data = snapshot.val();
        const leaves: LeaveModel[] = [];
        snapshot.forEach((leaveSnapshot) => {
          const leave = leaveSnapshot.val() as LeaveModel;
          leaves.push({ ...leave, key: leaveSnapshot.key });
        });
        subscriber.next(leaves);
        subscriber.complete();
      });
    });
  }

  getAllLeaves(status: string) {
    return new Observable<LeaveModel[]>((observer: Observer<LeaveModel[]>) => {
      const db = getDatabase();
      const leavesRef = ref(db, 'leaves/');
      const leavesQuery = query(
        leavesRef,
        orderByChild('status'),
        equalTo(status)
      );
      onValue(leavesQuery, (snapshot) => {
        const leaves: LeaveModel[] = [];
        if (snapshot.exists()) {
          snapshot.forEach((leaveSnapshot) => {
            const leave = leaveSnapshot.val() as LeaveModel;
            leaves.push({ ...leave, key: leaveSnapshot.key });
          });
  
          const hasDataChanged = JSON.stringify(this.currentLeaves) !== JSON.stringify(leaves);
  
          this.currentLeaves = leaves;
  
          if (hasDataChanged) {
            observer.next(leaves);
            this.listenerDb.next(leaves);
          }
        }
        observer.next(leaves);
        observer.complete();
      });
    });
  }

  updateRequest(leaveRequest: LeaveModel, argsStatus:string) {
    return new Observable<LeaveModel>((observer: Observer<LeaveModel>) => {
      const db = getDatabase();
      const reference = ref(db, 'leaves/' + leaveRequest.key);
      const updates = {
        status: argsStatus,
      };
      update(reference, updates).then(
        () => {
          observer.next(leaveRequest);
          this.authService.showErrorSnackbar('Leave Request Updated Successfully', 5000);
          observer.complete();
        },
        (reason) => {
          observer.error(reason);
          this.authService.showErrorSnackbar(`Leave Request Updation Failed ${reason}`, 5000);
        }
      );
    });
  }
}
