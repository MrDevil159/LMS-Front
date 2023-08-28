import { Component, OnInit, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Event } from 'src/app/shared/model/Event.model';
import { AdminService } from 'src/app/shared/services/admin.service';


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  constructor(private el: ElementRef, private adminService: AdminService, private router: Router, private route:ActivatedRoute) {}

  daysInMonth: number[] = [];
  holidays: Event[] = [
    { name: 'Republic Day', date: '2023-1-26', typeOfHoliday: 'National Holiday' },
    { name: 'Good Friday', date: '2023-4-14', typeOfHoliday: 'Religious Holiday' },
    { name: 'Maha Shivratri', date: '2023-3-1', typeOfHoliday: 'Religious Holiday' },
    { name: 'Holi', date: '2023-3-18', typeOfHoliday: 'Religious Holiday' },
    { name: 'Rama Navami', date: '2023-4-9', typeOfHoliday: 'Religious Holiday' },
    { name: 'Good Friday', date: '2023-4-14', typeOfHoliday: 'Religious Holiday' },
    { name: 'Id-ul-Fitr', date: '2023-5-2', typeOfHoliday: 'Religious Holiday' },
    { name: 'Independence Day', date: '2023-8-15', typeOfHoliday: 'National Holiday' },
    { name: 'Gandhi Jayanti', date: '2023-10-2', typeOfHoliday: 'National Holiday' },
    { name: 'Diwali', date: '2023-10-24', typeOfHoliday: 'Religious Holiday' },    
    { name: 'Christmas', date: '2023-12-25', typeOfHoliday: 'Religious Holiday' },
  ];
  currentMonth = new Date();
  displayedHolidays: Event[] = [];

  startingDay!: number; 
  emptyDaysBefore: number[] = []; 

  ngOnInit() {
    this.updateDisplayedHolidays();
    this.generateCalendar();
  }
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
    console.log(dayString);
    
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
}
