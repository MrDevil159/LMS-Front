import { Component, AfterViewInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/shared/services/admin.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements AfterViewInit {
  displayedColumns: string[] = ['name', 'email', 'designation', 'role', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>(); // Initialize here

  constructor(private adminService: AdminService, private cdr: ChangeDetectorRef, private router:Router) { 
    this.onGetUserData()
  }
  
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.cdr.detectChanges(); // Manually trigger change detection
  }

  onGetUserData() {
    this.adminService.getAllUserData().subscribe(
      {
        next: (res) => {
          const newArray = Object.keys(res).map(key => res[key]);
          this.dataSource.data = newArray;
          this.dataSource.paginator = this.paginator; // Reset the paginator
        },
        error: (err) => {
          console.log(err);
        }
      }
    )
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }
  
  editUser(element: any) {
    this.router.navigateByUrl('users/add', { state: {...element, edit: true} });
  }

  deleteUser(element: any) {

  }
}
