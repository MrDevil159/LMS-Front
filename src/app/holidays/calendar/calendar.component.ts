import { Component, OnInit, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';
import { Event } from 'src/app/shared/model/Event.model';
import { LeaveModel } from 'src/app/shared/model/LeaveRequest.model';
import { AdminService } from 'src/app/shared/services/admin.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LeavesService } from 'src/app/shared/services/leaves.service';
import { format, parse } from 'date-fns';


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit, OnDestroy {
  leaves:LeaveModel[] = [];
  subscription!: Subscription;
  constructor(private el: ElementRef, private adminService: AdminService, private router: Router, private route:ActivatedRoute, private leaveService:LeavesService, private authService:AuthService) {
  }
  check!:string;
  holidays: Event[] = [];
  getValueHoliday!:Subscription;
  ngOnInit() {
    const uniqueHolidays = new Set<Event>(); 
    this.subscription = this.leaveService.getAllLeavesNew('CONFIRMED').pipe(
      switchMap((data) => {
        this.leaves = data;  
        this.leaves.forEach((leave) => {
          const eventsForLeave = this.convertLeaveToEvent(leave);
          eventsForLeave.forEach((event) => {
            uniqueHolidays.add(event); 
          });
        });
  
        this.holidays = Array.from(uniqueHolidays); 
        this.updateDisplayedHolidays();
        this.generateCalendar();
        return this.adminService.getAllHoliday();
      })
    ).subscribe({
      next: (datainner) => {
        datainner.forEach((event) => {
          uniqueHolidays.add(event); 
        });
        this.holidays = Array.from(uniqueHolidays); 
        console.log(this.holidays);
      },
      error: (err) => console.log(err),
      complete: () => console.log('holiday complete')
    });
    this.updateDisplayedHolidays();
    this.generateCalendar();

  }
  
  convertLeaveToEvent(leave: LeaveModel): Event[] {
    const events: Event[] = [];
    const startDate = parse(leave.startDate, 'yyyy-MM-dd', new Date());
    const endDate = parse(leave.endDate, 'yyyy-MM-dd', new Date());
  
    if (leave.email) {
      while (startDate <= endDate) {
        const event: Event = {
          name: leave.email,
          date: format(startDate, 'yyyy-M-d'),
          typeOfHoliday: leave.typeOfLeave,
        };
        events.push(event);
        startDate.setDate(startDate.getDate() + 1);
      }
    }
    return events;
  }



  ngOnDestroy(): void {
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


  groupByTypeOfHoliday(day: number): { [key: string]: Event } {
    const events = this.eventsForDay(day); // Convert day to string when calling eventsForDay
    const groupedEvents: { [key: string]: Event } = {};
   
    events.forEach((event) => {
      const key = event.typeOfHoliday;
      if (!groupedEvents[key]) {
        groupedEvents[key] = event;
      }
    });
  
    return groupedEvents;
  }
  
  getKeys(obj: any): string[] {
    return Object.keys(obj);
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
    this.tooltipVisible = false;

  }
  
  nextMonth() {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 1);
    this.updateDisplayedHolidays();
    this.generateCalendar();
    this.tooltipVisible = false;

  }
  tooltipVisible = false;
  tooltipText = '';

  showTooltip(event: MouseEvent, day: number) {
    const target = event.target as HTMLElement;
    const rect = target.getBoundingClientRect();
    this.tooltipText = this.eventsForDay(day).map(event => `<div class="legend-item"><div class="color-box ${event.typeOfHoliday}"></div>${event.name}(${event.typeOfHoliday})</div>`).join('<br> ');
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


}