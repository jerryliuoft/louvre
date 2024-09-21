import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BodyPanelComponent } from './components/body-panel/body-panel.component';
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BodyPanelComponent, HeaderComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor() {}
}
