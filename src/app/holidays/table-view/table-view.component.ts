import { Component, OnDestroy } from '@angular/core';
import {AfterViewInit, ViewChild} from '@angular/core';

import { Subscription } from 'rxjs';
import { Event } from 'src/app/shared/model/Event.model';
import { AdminService } from 'src/app/shared/services/admin.service';

import {MatPaginator } from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-table-view',
  templateUrl: './table-view.component.html',
  styleUrls: ['./table-view.component.css']
})
export class TableViewComponent implements AfterViewInit, OnDestroy {
  displayedColumns: string[] = ['name', 'date', 'typeOfHoliday', 'action'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource: MatTableDataSource<Event> = new MatTableDataSource<Event>(); 

  leaves: Subscription;
  constructor(private adminService: AdminService, private router:Router, private route:ActivatedRoute) {
    this.leaves = this.adminService.getAllHoliday().subscribe(
      {
        next: (data)=> {
          this.dataSource = new MatTableDataSource(data);
        },
        error: (err)=> {
          console.log(err);
        },
        complete: ()=> {
          console.log('Complete Subscription');
          
        }
      }
    )
  }
  ngOnDestroy(): void {
    this.leaves.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;  
  }

  applyFilter(event: KeyboardEvent) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  addHoliday() {
    this.router.navigate(['../edit'], {relativeTo: this.route})
  }

  editHoliday(event: Event) {
    this.router.navigate(['../edit'], {relativeTo: this.route, state: {...event, edit: true, goto: 'list'}});

  }

  deleteHoliday(event: Event) {
    if (confirm('Are you sure you want to delete this holiday?')) {
      const index = this.dataSource.data.findIndex(holiday => holiday.name === event.name);
      if (index !== -1) {
        this.dataSource.data.splice(index, 1);
  
        this.dataSource.data = [...this.dataSource.data];
  
        this.adminService.deleteHolidayEvent(event);
      }
    }
  }
  
}

