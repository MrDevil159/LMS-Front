import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LeavesService } from 'src/app/shared/services/leaves.service';
import { NavigationService } from 'src/app/shared/services/navigation.service';

@Component({
  selector: 'app-apply-leave',
  templateUrl: './apply-leave.component.html',
  styleUrls: ['./apply-leave.component.css'],
})
export class ApplyLeaveComponent implements OnInit {
  leaveForm!: FormGroup;
  key!:string;
  email!:string;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private leaveService: LeavesService,
    private navService: NavigationService,
    private route: ActivatedRoute
  ) {

    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      const editMode = navigation.extras.state;
      console.log('check');
      console.log(editMode);

      if (editMode) {
        this.edit = true;
        this.key = editMode['key'];
        this.email = editMode['email'];

        console.log(this.key);
        
        this.leaveForm = this.fb.group({
          startDate: [new Date(editMode['startDate']), Validators.required],
          endDate: [new Date(editMode['endDate']), Validators.required],
          reason: [editMode['reason'], Validators.required],
          typeOfLeave: [editMode['typeOfLeave'], Validators.required],
        });
      }
    } else {
      this.leaveForm = this.fb.group({
        startDate: ['', Validators.required],
        endDate: ['', Validators.required],
        reason: ['', Validators.required],
        typeOfLeave: ['', Validators.required],
      });
    }

  }

  ngOnInit() {
    

  }
  formatDateToYYYYMD(dateString: any) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // JavaScript months are 0-based
    const day = date.getDate();

    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
  }
  onSubmit() {
    if (this.leaveForm.valid) {
      const startDate = this.leaveForm.value.startDate;
      const endDate = this.leaveForm.value.endDate;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (startDate.getTime() <= today.getTime() - 1) {
        this.authService.showErrorSnackbar('Date should be greater than today');
        return;
      }

      if (endDate.getTime() <= startDate.getTime() - 1) {
        this.authService.showErrorSnackbar(
          'End date should be greater than start date'
        );
        return;
      }
      const leave = {
        reason: this.leaveForm.value.reason,
        startDate: this.formatDateToYYYYMD(this.leaveForm.value.startDate),
        endDate: this.formatDateToYYYYMD(this.leaveForm.value.endDate),
        typeOfLeave: this.leaveForm.value.typeOfLeave,
        status: 'PENDING',
      };

      console.log(leave);
      this.leaveService.getMyLeaves();
      this.leaveService.insertLeave(leave);
      this.router.navigate(['/leaves']);
    }
  }

  edit = false;

  onEdit() {
    if (this.leaveForm.valid) {
      const startDate = this.leaveForm.value.startDate;
      const endDate = this.leaveForm.value.endDate;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (startDate.getTime() <= today.getTime() - 1) {
        this.authService.showErrorSnackbar('Date should be greater than today');
        return;
      }

      if (endDate.getTime() <= startDate.getTime() - 1) {
        this.authService.showErrorSnackbar(
          'End date should be greater than start date'
        );
        return;
      }
      const leave = {
        reason: this.leaveForm.value.reason,
        startDate: this.formatDateToYYYYMD(this.leaveForm.value.startDate),
        endDate: this.formatDateToYYYYMD(this.leaveForm.value.endDate),
        typeOfLeave: this.leaveForm.value.typeOfLeave,
        status: 'PENDING',
      };

      console.log(leave);
      this.leaveService.getMyLeaves();

      if(this.key) {
        this.leaveService.editLeave({...leave, email: this.email},this.key);
      }
      this.router.navigate(['/leaves']);
    }
  }

  goBack() {
    this.navService.goBack();
  }
}
