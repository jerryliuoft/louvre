import { Component, input, Input, OnInit } from '@angular/core';
import { BodyPanelComponent } from './components/item-view/item-view.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { DisplayConfigsComponent } from './components/display-configs/display-configs.component';
import { DisplayService } from '../../services/display.service';
import { DirectoryViewComponent } from './components/directory-view/directory-view.component';
import { HeaderComponent } from './components/header/header.component';
import { FilesService } from '../../services/files.service';
import { ActivatedRoute } from '@angular/router';

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
export class FrontPageComponent implements OnInit {
  @Input({}) path = '';
  constructor(
    protected displayService: DisplayService,
    private filesService: FilesService,
    private route: ActivatedRoute
  ) {
    this.route.paramMap.subscribe((params) => {
      const newPath = params.get('path');
      if (newPath) {
        this.filesService.setNewDirectory(decodeURIComponent(newPath));
      }
    });
  }

  ngOnInit(): void {
    if (this.path) {
      this.filesService.setNewDirectory(decodeURIComponent(this.path));
    }
  }
}
