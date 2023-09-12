import {
  Component,
  AfterViewInit,
  ViewChild,
  ChangeDetectorRef,
  OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmBoxComponent } from 'src/app/shared/components/confirm-box/confirm-box.component';
import { AdminService } from 'src/app/shared/services/admin.service';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements AfterViewInit, OnInit {

  displayedColumns: string[] = [
    'name',
    'email',
    'designation',
    'role',
    'actions',
  ];
  load = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>(); // Initialize here
  refresh: any;

  constructor(
    private adminService: AdminService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {
    this.onGetUserData();
    this.refresh = this.router.getCurrentNavigation()!.extras.state;
    console.log(this.refresh);
  }
  ngOnInit(): void {
    this.authService.showErrorSnackbar('Loading Data, Please Wait...', 2500);
    if (this.refresh && this.refresh.refresh === true) {
      console.log('check');
      this.onGetUserData();
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.cdr.detectChanges();
  }

  onGetUserData() {
    this.load = true;
    this.adminService.getAllUserData().subscribe({
      next: (res) => {
        const flattenedData = Object.values(res).map((user) => {
          const userDetails = user.userDetails
            ? user.userDetails[Object.keys(user.userDetails)[0]]
            : {};
          return {
            uid: user.uid,
            metadata: user.metadata,
            providerData: user.providerData,
            disabled: user.disabled,
            email: user.email,
            emailVerified: user.emailVerified,
            ...userDetails,
          };
        });

        this.dataSource.data = flattenedData;
        this.load = false; 
        this.dataSource.paginator = this.paginator;
      },
      error: (err) => {
        console.log(err);
        this.load = false;
        this.authService.showErrorSnackbar('Try Pressing Load User.', 5000);
      },
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  editUser(element: any) {
    this.router.navigateByUrl('users/add', {
      state: { ...element, edit: true },
    });
  }

  deleteUser(element: any) {
    if (element.designation === 'Owner') {
      this.authService.showErrorSnackbar('Owner Cannot be deleted', 5000);
      return;
    }
    const dialogRef = this.dialog.open(ConfirmBoxComponent, {
      width: '250px',
      data: { message: 'Are you sure you want to proceed?' }, // Pass the message data
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.adminService.deleteUser(element.uid, element.email).subscribe({
          next: () => {
            this.authService.showErrorSnackbar(
              'User deleted successfully',
              5000
            );
            console.log('User deleted successfully');
            this.onGetUserData();
          },
          error: (error) => {
            this.authService.showErrorSnackbar('User deletion Failed', 5000);
            console.error('Error deleting user:', error);
          },
        });
      } else {
        console.log('Event Cancelled');
      }
    });
  }
}
