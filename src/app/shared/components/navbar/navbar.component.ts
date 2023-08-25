import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {  
  @Output() public sidenavToggle = new EventEmitter();
  constructor(public authService: AuthService) {}
  public onToggleSidenav = () => { 
    this.sidenavToggle.emit();
  }

}
