import { Component, Input, AfterViewInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { LeaveModel } from 'src/app/shared/model/LeaveRequest.model';
import { LeavesService } from 'src/app/shared/services/leaves.service';
import { MatSort } from '@angular/material/sort';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-table-data',
  templateUrl: './table-data.component.html',
  styleUrls: ['./table-data.component.css']
})

export class TableDataComponent implements AfterViewInit {
  @Input() data!: LeaveModel[];

  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<LeaveModel>;
  constructor(private leaveService:LeavesService, private cdr:ChangeDetectorRef, private authService:AuthService, private router:Router, private route:ActivatedRoute) {

  }
 
  displayedColumns: string[] = ['startDate', 'endDate', 'status', 'typeOfLeave', 'reason', 'action'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit() {
    setTimeout(() => {
      this.dataSource = new MatTableDataSource<LeaveModel>(this.data);
      console.log(this.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.cdr.detectChanges(); // Manually trigger change detection to resolve the error
    });
  }
  
  editLeave(elem:LeaveModel) {
    console.log(elem);
    this.router.navigate(['apply'], {relativeTo: this.route, state: {...elem, edit: true} });
  }

  deleteLeave(elem: LeaveModel) {
    if (elem.key) { 
      console.log(elem);
      this.leaveService.deleteLeave(elem.key).then(
        (response) => {
          console.log(response);
          const index = this.dataSource.data.findIndex(item => item === elem);
          this.authService.showErrorSnackbar('Deleted Leave Request Successfully');
          if (index >= 0) {
            this.dataSource.data.splice(index, 1);
            this.dataSource._updateChangeSubscription();
          }
        }
      );
    } else {
      console.log('Cannot delete: Invalid key');
      this.authService.showErrorSnackbar('Deletion Failed');

    }
  }
  
  

}
