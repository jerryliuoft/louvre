import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BodyPanelComponent } from './pages/front-page/components/body-panel/body-panel.component';
import { HeaderComponent } from './pages/front-page/components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BodyPanelComponent, HeaderComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor() {}
}
