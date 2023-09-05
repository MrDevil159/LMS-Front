import { Component, OnInit, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Event } from 'src/app/shared/model/Event.model';
import { LeaveModel } from 'src/app/shared/model/LeaveRequest.model';
import { AdminService } from 'src/app/shared/services/admin.service';
import { LeavesService } from 'src/app/shared/services/leaves.service';


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit, OnDestroy {
  leaves:LeaveModel[] = [];
  subscription!: Subscription;
  constructor(private el: ElementRef, private adminService: AdminService, private router: Router, private route:ActivatedRoute, private leaveService:LeavesService) {
  }
 
  holidays: Event[] = [];
  getValueHoliday!:Subscription;
  ngOnInit() {
    this.subscription = this.leaveService.getAllLeaves('CONFIRMED').subscribe(
      {
        next: (data) => {
          this.leaves = data;
          const uniqueHolidays = new Set<Event>(); // Create a Set to store unique Event objects
  
          this.leaves.forEach((leave) => {
            const eventsForLeave = this.convertLeaveToEvent(leave);
            eventsForLeave.forEach((event) => {
              uniqueHolidays.add(event); // Add each Event object to the Set
            });
          });
  
          this.holidays = Array.from(uniqueHolidays); // Convert the Set back to an array
  
          this.getValueHoliday = this.adminService.getAllHoliday().subscribe(
            {
              next: (datainner) => {
                datainner.forEach((event) => {
                  uniqueHolidays.add(event); // Add each Event object from datainner to the Set
                });
                this.holidays = Array.from(uniqueHolidays); // Convert the Set back to an array
                console.log(this.holidays);

              },
              error: (err) => console.log(err),
              complete: () => console.log('holiday complete')
            }
          );
        },
        error: (err) => {
          console.log('Failed Loading Leaves', err);
        },
        complete: () => {
          console.log('Completed Loading Leaves Subscription');
        }
      }
    );
  
    this.updateDisplayedHolidays();
    this.generateCalendar();
  }
  
  


  ngOnDestroy(): void {
    this.getValueHoliday.unsubscribe();
    this.subscription.unsubscribe();
  }

  daysInMonth: number[] = [];

  currentMonth = new Date();
  displayedHolidays: Event[] = [];

  startingDay!: number; 
  emptyDaysBefore: number[] = []; 

  weekdays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  generateCalendar() {
    const daysInCurrentMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() + 1,
      0
    ).getDate();
    this.daysInMonth = Array.from({ length: daysInCurrentMonth }, (_, i) => i + 1);

    const firstDayOfMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 1);
    const startingDay = firstDayOfMonth.getDay();

    this.emptyDaysBefore = Array.from({ length: startingDay }, (_, i) => i);
  }
  eventsForDay(day: number): Event[] {
    const dayString = `${this.currentMonth.getFullYear()}-${this.currentMonth.getMonth() + 1}-${day}`;
    
    return this.holidays.filter(holiday => holiday.date === dayString);
  }
  isToday(day: number): boolean {
    const today = new Date();
    return (
      day === today.getDate() &&
      this.currentMonth.getMonth() === today.getMonth() &&
      this.currentMonth.getFullYear() === today.getFullYear()
    );
  }
  updateDisplayedHolidays() {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth() + 1;
    const daysInCurrentMonth = new Date(year, month, 0).getDate();
    this.daysInMonth = Array.from({ length: daysInCurrentMonth }, (_, i) => i + 1);

    const monthKey = `${year}-${month}`;
    this.displayedHolidays = this.holidays.filter(holiday => holiday.date.startsWith(monthKey));
  }

  previousMonth() {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1, 1);
    this.updateDisplayedHolidays();
    this.generateCalendar();
  }
  
  nextMonth() {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 1);
    this.updateDisplayedHolidays();
    this.generateCalendar();
  }
  tooltipVisible = false;
  tooltipText = '';

  showTooltip(event: MouseEvent, day: number) {
    const target = event.target as HTMLElement;
    const rect = target.getBoundingClientRect();
    this.tooltipText = this.eventsForDay(day).map(event => `${event.name}(${event.typeOfHoliday})`).join(', ');
    this.tooltipVisible = true;
  }
  

  addHoliday() {
    this.router.navigate(['edit'], {relativeTo: this.route})
  }



  eventEdit(event: Event) {
    this.router.navigate(['edit'], {relativeTo: this.route, state: {...event, edit: true, goto: 'calendar'}});
  }


  deleteHoliday(event: Event) {
    if (confirm('Are you sure you want to delete this holiday?')) {
      this.holidays = this.holidays.filter(holiday => holiday.name !== event.name);
      this.adminService.deleteHolidayEvent(event);
    }
  }




  // Define a function to convert LeaveModel to Event
  convertLeaveToEvent(leave: LeaveModel): Event[] {
    const events: Event[] = [];
    const startDate = new Date(leave.startDate);
    const endDate = new Date(leave.endDate);
  
    if (leave.email) {
      while (startDate <= endDate) {
        const event: Event = {
          name: leave.email,
          date: this.formatDateToYYYYMD(startDate), // Format date as yyyy-mm-dd
          typeOfHoliday: leave.typeOfLeave,
        };
        events.push(event);
  
        startDate.setDate(startDate.getDate() + 1);
      }
    }
    
    return events;
  }
  
  formatDateToYYYYMD(date: Date): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Adding 1 because getMonth() returns 0-based month (0 = January)
    const day = date.getDate();
  
    // Use template literals to format the date
    return `${year}-${month}-${day}`;
  }


}