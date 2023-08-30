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
} from '@angular/fire/database';
import { Observable, catchError, from, tap, throwError } from 'rxjs';
import { LeaveModel } from '../model/LeaveRequest.model';
import { Auth, getAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class LeavesService {
  authfb!: Auth;

  constructor(private database: Database) {
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

  async getMyLeaves(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const db = getDatabase();
      const email = this.authfb.currentUser?.email;
      if (email) {
        const leavesRef = ref(db, 'leaves/');
        const leavesSnapshot = await get(
          query(leavesRef, orderByChild('email'), equalTo(email))
        );
        const leaves: any[] = [];
        if (leavesSnapshot.exists()) {
          leavesSnapshot.forEach((leaveSnapshot: { val: () => any }) => {
            leaves.push(leaveSnapshot.val());
          });
          resolve(leaves);
        } else {
          reject('no snapshot');
        }
      }
    });
  }
}
