import { Component } from '@angular/core';
import { BodyPanelComponent } from './components/body-panel/body-panel.component';
import { HeaderComponent } from './components/header/header.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { DisplayConfigsComponent } from './components/display-configs/display-configs.component';

@Component({
  selector: 'app-front-page',
  standalone: true,
  imports: [
    BodyPanelComponent,
    HeaderComponent,
    MatSidenavModule,
    DisplayConfigsComponent,
  ],
  templateUrl: './front-page.component.html',
  styleUrl: './front-page.component.scss',
})
export class FrontPageComponent {}
