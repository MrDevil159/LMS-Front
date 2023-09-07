import {
  Component,
  Input,
  AfterViewInit,
  ViewChild,
  ChangeDetectorRef,
  OnDestroy
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { LeaveModel } from 'src/app/shared/model/LeaveRequest.model';
import { LeavesService } from 'src/app/shared/services/leaves.service';
import { MatSort } from '@angular/material/sort';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmBoxComponent } from 'src/app/shared/components/confirm-box/confirm-box.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-table-data',
  templateUrl: './table-data.component.html',
  styleUrls: ['./table-data.component.css'],
})
export class TableDataComponent implements AfterViewInit, OnDestroy {
  @Input() data!: LeaveModel[];

  @ViewChild(MatSort) sort!: MatSort;
  pageSizeOptions: number[] = [6, 12, 18];
  pageSize: number = 6; 
  obs!: Observable<LeaveModel[]>;


  dataSource = new MatTableDataSource<LeaveModel>();
  constructor(
    private leaveService: LeavesService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}
  ngOnDestroy(): void {
    if (this.dataSource) {
      this.dataSource.disconnect();
    }
  }

  displayedColumns: string[] = [
    'startDate',
    'endDate',
    'status',
    'typeOfLeave',
    'reason',
    'action',
  ];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit() {

    this.dataSource.data = this.data; 
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.obs = this.dataSource.connect();
    this.cdr.detectChanges(); 
  }

  editLeave(elem: LeaveModel) {
    console.log(elem);
    this.router.navigate(['apply'], {
      relativeTo: this.route,
      state: { ...elem, edit: true },
    });
  }

  deleteLeave(elem: LeaveModel) {
    const dialogRef = this.dialog.open(ConfirmBoxComponent, {
      width: '250px',
      data: { message: 'Are you sure you want to proceed?' }, // Pass the message data
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (elem.key) {
          console.log(elem);
          this.leaveService.deleteLeave(elem.key).then((response) => {
            console.log(response);
            const index = this.dataSource.data.findIndex(
              (item) => item === elem
            );
            this.authService.showErrorSnackbar(
              'Deleted Leave Request Successfully',
              5000
            );
            if (index >= 0) {
              this.dataSource.data.splice(index, 1);
              this.dataSource._updateChangeSubscription();
            }
          });
        } else {
          console.log('Cannot delete: Invalid key');
          this.authService.showErrorSnackbar('Deletion Failed', 5000);
        }
      } else {
        console.log('Event Cancelled');
      }
    });
  }
}
