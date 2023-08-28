import { Component } from '@angular/core';

@Component({
  selector: 'app-holiday-outlet',
  templateUrl: './holiday-outlet.component.html',
  styleUrls: ['./holiday-outlet.component.css'],
})
export class HolidayOutletComponent {

  events: any[] = [
    { title: 'Republic Day', start: '26-Jan-2023', type: 'National Holiday' },
    { title: 'Good Friday', start: '14-Apr-2023', type: 'Religious Holiday' },
    { title: 'Maha Shivratri', start: '01-Mar-2023', type: 'Religious Holiday' },
    { title: 'Holi', start: '18-Mar-2023', type: 'Religious Holiday' },
    { title: 'Rama Navami', start: '09-Apr-2023', type: 'Religious Holiday' },
    { title: 'Good Friday', start: '14-Apr-2023', type: 'Religious Holiday' },
    { title: 'Id-ul-Fitr', start: '02-May-2023', type: 'Religious Holiday' },
    { title: 'Muharram', start: '28-Aug-2023', type: 'Religious Holiday' },
    { title: 'Independence Day', start: '15-Aug-2023', type: 'National Holiday' },
    { title: 'Gandhi Jayanti', start: '2-Oct-2023', type: 'National Holiday' },
    { title: 'Diwali', start: '24-Oct-2023', type: 'Religious Holiday' },
    { title: 'Christmas', start: '25-Dec-2023', type: 'Religious Holiday' },
  ];

  constructor() {
  }

}
