import { Component, OnInit } from '@angular/core';
import { LeaveModel } from 'src/app/shared/model/LeaveRequest.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LeavesService } from 'src/app/shared/services/leaves.service';

@Component({
  selector: 'app-leave-list',
  templateUrl: './leave-list.component.html',
  styleUrls: ['./leave-list.component.css']
})
export class LeaveListComponent implements OnInit {
  constructor( private leaveService: LeavesService, private authService:AuthService) {
  }
  confirmed: LeaveModel[] = [];
  pending: LeaveModel[] = [];
  rejected: LeaveModel[] = [];
  ngOnInit(): void {
    this.getLeaves();
  }
  dataLoaded = false;

  getLeaves() {
    try {
      console.log('Fetching leaves...');
      this.leaveService.getMyLeaves().subscribe({
        next: (data) => {
          this.processLeaves(data);
        },
        error: (err) => {
          console.log(err);
          
        },
        complete: () => {
          console.log('Leaves loaded');
          this.dataLoaded = true;
          
         }
      })
    } catch (error) {
      console.error('Error fetching leaves:', error);
    }
  }
  processLeaves(data: LeaveModel[]) {
    data.forEach(item => {
      if (item.status === 'PENDING') {
        this.pending.push(item);
      } else if (item.status === 'CONFIRMED') {
        this.confirmed.push(item);
      } else if (item.status === 'REJECTED') {
        this.rejected.push(item);
      }
    });
    console.log(this.confirmed);
    console.log(this.pending);
    console.log(this.rejected);

    this.dataLoaded = true;
  }
  isAdmin() {
    return this.authService.isAdmin();
  }

}
