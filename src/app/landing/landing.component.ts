import { Component } from '@angular/core';
import { NavigationService } from '../shared/services/navigation.service';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent {
  constructor(public navigationService:NavigationService, public authService:AuthService) {

  }
}
