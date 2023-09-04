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
    const editMode = this.router.getCurrentNavigation()!.extras.state;
    if (editMode) {
      this.newUser.setValue({
        name: editMode['name'],
        email: [''],
        designation: editMode['designation'],
        password: [''],
        role: editMode['name'],
      });
    }
  }

  onAddUser() {
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
                );
                this.router.navigate(['/users']);
              },
              error: (error) => {
                console.log(error);
                this.authService.showErrorSnackbar(error.errors.message);
              },
              complete: () =>
                console.log('Completed inserting of data Model subscription'),
            });
        },
        error: (error) => {
          this.authService.showErrorSnackbar(error);
        },
        complete: () => {
          console.log('onAddUser function completed');
        },
      });
  }
  goBack() {
    this.navService.goBack();
  }
}
