import { state } from '@angular/animations';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/shared/services/admin.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { NavigationService } from 'src/app/shared/services/navigation.service';

@Component({
  selector: 'app-user-add-form',
  templateUrl: './user-add-form.component.html',
  styleUrls: ['./user-add-form.component.css'],
})
export class UserAddFormComponent {
  newUser: FormGroup;
  uid!: string;
  oldEmail!: string;
  editMode!: any;
  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private authService: AuthService,
    private router: Router,
    private navService:NavigationService
  ) {
    this.newUser = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      designation: ['', Validators.required],
      password: ['', Validators.required],
      role: ['', Validators.required],
    });
    this.editMode = this.router.getCurrentNavigation()!.extras.state;
    if (this.editMode) {
      this.uid = this.editMode['uid'];
      this.oldEmail = this.editMode['email'];
      console.log(this.uid);
      this.newUser.setValue({
        name: this.editMode['name'],
        email: this.editMode['email'],
        designation: this.editMode['designation'],
        password: [''],
        role: this.editMode['role'],
      });
    }
  }

  onAddUser() {
    const email = this.newUser.value.email;
    console.log(this.newUser.value);
    this.adminService
      .registerUser(this.newUser.value.email, this.newUser.value.password)
      .subscribe({
        next: () => {
          this.adminService
            .insertUserDataModel({
              designation: this.newUser.value.designation,
              email: this.newUser.value.email,
              name: this.newUser.value.name,
              role: this.newUser.value.role,
            })
            .subscribe({
              next: (response) => {
                console.log(response);
                this.newUser.reset();
                this.authService.showErrorSnackbar(
                  'Adding new user successful'
                ,3000);
                this.authService.forgotPassword(email);
                this.router.navigate(['/users'], { state: { refresh: false } });
              },
              error: (error) => {
                console.log(error);
                this.authService.showErrorSnackbar(error.errors.message,5000);
              },
              complete: () =>
                console.log('Completed inserting of data Model subscription'),
            });
        },
        error: (error) => {
          this.authService.showErrorSnackbar(error, 5000);
        },
        complete: () => {
          console.log('onAddUser function completed');
        },
      });
  }

  onEditUser() {
    this.authService.showErrorSnackbar('Please Wait ...',5000);
    this.adminService.editUser(this.uid, {
      designation: this.newUser.value.designation,
      oldEmail: this.oldEmail,
      email: this.newUser.value.email,
      name: this.newUser.value.name,
      password: this.newUser.value.password,
      role: this.newUser.value.role,
    }).subscribe({
      next: (res)=> {
        this.authService.showErrorSnackbar('Update Successfully', 5000);
        this.router.navigate(['/users'], { state: { refresh: true } });
      },
      error: (err)=> {
        console.log(err);
        this.authService.showErrorSnackbar(err.errors.message, 5000);
      }
    })
  }
  goBack() {
    this.navService.goBack();
  }
}
