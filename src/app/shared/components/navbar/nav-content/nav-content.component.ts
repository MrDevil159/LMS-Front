import { Component, EventEmitter, Output, inject } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-nav-content',
  templateUrl: './nav-content.component.html',
  styleUrls: ['./nav-content.component.css']
})
export class NavContentComponent {
  @Output() sidenavClose = new EventEmitter();
  authService = inject(AuthService);
  public onSidenavClose = () => {
    this.sidenavClose.emit();
  }
}
