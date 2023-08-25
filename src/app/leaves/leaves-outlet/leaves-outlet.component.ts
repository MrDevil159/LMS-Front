import { Component } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-leaves-outlet',
  templateUrl: './leaves-outlet.component.html',
  styleUrls: ['./leaves-outlet.component.css']
})
export class LeavesOutletComponent {
  constructor(private authService:AuthService) {}
  onAuthCheck() {
    console.log(this.authService.isAuthenticated());
  }
}
