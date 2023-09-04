import { Component, OnInit, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Event } from 'src/app/shared/model/Event.model';
import { AdminService } from 'src/app/shared/services/admin.service';


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit, OnDestroy {
  constructor(private el: ElementRef, private adminService: AdminService, private router: Router, private route:ActivatedRoute) {
    
  }
  ngOnDestroy(): void {
    this.getValueHoliday.unsubscribe();
  }
  holidays: Event[] = [
    
  ];
  getValueHoliday!:Subscription;
  ngOnInit() {
      this.getValueHoliday = this.adminService.getAllHoliday().subscribe(
      {
        next: (data) => {
          // data.forEach(item => {
          //   this.holidays.push(item);
          // });
          this.holidays = data;
        },
        error: (err) => console.log(err),
        complete: ()=> console.log('holiday complete')
      }
    )
    this.updateDisplayedHolidays();
    this.generateCalendar();
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
    this.tooltipText = this.eventsForDay(day).map(event => event.name).join(', ');
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