import { Component } from '@angular/core';
import { FrontPageComponent } from './pages/front-page/front-page.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FrontPageComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor() {}
}
