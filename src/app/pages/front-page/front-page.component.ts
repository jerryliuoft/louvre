import { Component, Input, OnInit, signal } from '@angular/core';
import { BodyPanelComponent } from './components/item-view/item-view.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { DisplayConfigsComponent } from './components/display-configs/display-configs.component';
import { DisplayService } from '../../services/display.service';
import { DirectoryViewComponent } from './components/directory-view/directory-view.component';
import { HeaderComponent } from './components/header/header.component';
import { FilesService } from '../../services/files.service';
import { ActivatedRoute } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-front-page',
  standalone: true,
  imports: [
    BodyPanelComponent,
    HeaderComponent,
    MatSidenavModule,
    DisplayConfigsComponent,
    DirectoryViewComponent,
    MatProgressSpinnerModule,
  ],
  templateUrl: './front-page.component.html',
  styleUrl: './front-page.component.scss',
})
export class FrontPageComponent implements OnInit {
  @Input({}) path = '';
  constructor(
    protected displayService: DisplayService,
    protected filesService: FilesService,
    private route: ActivatedRoute
  ) {
    this.route.paramMap.subscribe((params) => {
      const newPath = params.get('path');
      if (newPath && newPath !== 'undefined') {
        const decoded = decodeURIComponent(newPath);
        this.filesService.setNewDirectory(decoded);
        
        // Only switch to 'item' mode if it's a subfolder, NOT the root folder.
        if (decoded !== this.filesService.currentPath()) {
           this.displayService.displayType.set('item');
        } else {
           // We keep the current view, but normally on root you might want 'folder'
           this.displayService.displayType.set('folder'); 
        }
      }
    });
  }

  ngOnInit(): void {
    if (this.path) {
      const decoded = decodeURIComponent(this.path);
      this.filesService.setNewDirectory(decoded);
      if (decoded !== this.filesService.currentPath()) {
        this.displayService.displayType.set('item');
      } else {
        this.displayService.displayType.set('folder');
      }
    }
  }
}
