import { Component } from '@angular/core';
import { BodyPanelComponent } from './components/item-view/item-view.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { DisplayConfigsComponent } from './components/display-configs/display-configs.component';
import { DisplayService } from '../../services/display.service';
import { DirectoryViewComponent } from './components/directory-view/directory-view.component';
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'app-front-page',
  standalone: true,
  imports: [
    BodyPanelComponent,
    HeaderComponent,
    MatSidenavModule,
    DisplayConfigsComponent,
    DirectoryViewComponent,
  ],
  templateUrl: './front-page.component.html',
  styleUrl: './front-page.component.scss',
})
export class FrontPageComponent {
  constructor(protected displayService: DisplayService) {}
}
