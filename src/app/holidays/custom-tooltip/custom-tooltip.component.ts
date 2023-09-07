import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-custom-tooltip',
  templateUrl: './custom-tooltip.component.html',
  styleUrls: ['./custom-tooltip.component.css'],
  encapsulation: ViewEncapsulation.None, // Set encapsulation to None

})
export class CustomTooltipComponent {
  @Input() tooltipText: string = '';
}
