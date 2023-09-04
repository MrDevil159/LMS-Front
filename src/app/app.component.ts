import { Component } from '@angular/core';
import { AuthService } from './shared/services/auth.service';
import { NavigationService } from './shared/services/navigation.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'LMS';

  constructor(private authService: AuthService, private navService:NavigationService) {
    this.authService.isLoggedIn();
    this.navService.startSaveHistory();
  }

}
