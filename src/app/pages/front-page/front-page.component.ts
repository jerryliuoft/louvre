import { Component } from '@angular/core';
import { BodyPanelComponent } from '../../components/body-panel/body-panel.component';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-front-page',
  standalone: true,
  imports: [BodyPanelComponent, HeaderComponent],
  templateUrl: './front-page.component.html',
})
export class FrontPageComponent {}
