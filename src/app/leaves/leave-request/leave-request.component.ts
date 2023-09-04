import { ChangeDetectorRef, Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { LeaveModel } from 'src/app/shared/model/LeaveRequest.model';
import { LeavesService } from 'src/app/shared/services/leaves.service';

@Component({
  selector: 'app-leave-request',
  templateUrl: './leave-request.component.html',
  styleUrls: ['./leave-request.component.css']
})
export class LeaveRequestComponent {
  requests!: LeaveModel[];
  private listenerDb!: Subscription;
  dataLoaded = false;
  constructor(private leaveService: LeavesService, private cdr:ChangeDetectorRef) {
    this.getLeavesSub();
  }
  ngOnInit() {
    this.listenerDb = this.leaveService.listenerDb$.subscribe(
      () => {
        this.getLeavesSub();
      }
    );
  }

  ngOnDestroy() {
    this.listenerDb.unsubscribe();
  }

  getLeavesSub() {
    this.leaveService.getAllLeaves('PENDING').subscribe({
      next: (data) => {
        this.dataLoaded = true;
        console.log(data);
        if (!this.requests) {
          this.requests = [];
        }
  
        // Filter out items that are already in requests
        const newData = data.filter((item) => !this.requests.some((request) => request.key === item.key));
  
        // Append only the new data to the existing requests
        this.requests = this.requests.concat(newData);      
      
        this.requests = this.requests.filter((request) => data.some((item) => item.key === request.key));

      }


        
    });
  }

  approve(leaveRequest: LeaveModel) {
    console.log('Leave request approved:', leaveRequest);
    this.leaveService.updateRequest(leaveRequest, 'CONFIRMED').subscribe({
      next: (val) => {
        console.log('Leave request Approved Success', val);
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        this.getLeavesSub(); 
        console.log('Completed approve Observable');
      }
    });
  }

  reject(leaveRequest: LeaveModel) {
    console.log('Leave request approved:', leaveRequest);
    this.leaveService.updateRequest(leaveRequest, 'REJECTED').subscribe({
      next: (val) => {
        console.log('Leave request Rejected Success', val);
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        this.getLeavesSub(); 
        console.log('Completed approve Observable');
      }
    });
  }
}
