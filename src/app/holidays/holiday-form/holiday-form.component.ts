import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/shared/services/admin.service';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-holiday-form',
  templateUrl: './holiday-form.component.html',
  styleUrls: ['./holiday-form.component.css']
})
export class HolidayFormComponent {
  holidayForm: FormGroup;
  constructor(private adminService: AdminService, private fb:FormBuilder, private authService:AuthService, private router: Router) {
    this.holidayForm = this.fb.group({
      name: ['', Validators.required],
      date: ['', Validators.required],
      typeOfHoliday: ['', Validators.required],
    });
  }

  formatDateToYYYYMD(dateString: any) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // JavaScript months are 0-based
    const day = date.getDate();
  
    const formattedDate = `${year}-${month}-${day}`;
  
    return formattedDate;
  }

  enterToDatabase() {
    try {
      this.adminService.enterHolidayData(this.holidayForm.value.name, this.formatDateToYYYYMD(this.holidayForm.value.date), this.holidayForm.value.typeOfHoliday);
      this.authService.showErrorSnackbar(
        'Adding new Holiday successfully'
      );
      this.holidayForm.reset();
      this.router.navigate(['/holidays']);

    } catch(error) {
      this.authService.showErrorSnackbar(
        'Error Adding Holiday'
      );
      console.log(error);
    }
  }

  viewData() {
    this.adminService.readHolidayData(this.holidayForm.value.name)
  }

  checkLogin() {
    console.log(    this.authService.isLoggedIn()    );
  }
}
