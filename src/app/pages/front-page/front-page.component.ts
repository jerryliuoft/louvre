import { Component, OnInit, effect } from '@angular/core';
import { ItemViewComponent } from './components/item-view/item-view.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { DisplayConfigsComponent } from './components/display-configs/display-configs.component';
import { DisplayService } from '../../services/display.service';
import { DirectoryViewComponent } from './components/directory-view/directory-view.component';
import { HeaderComponent } from './components/header/header.component';
import { FilesService } from '../../services/files.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FaceViewComponent } from './components/face-view/face-view';

@Component({
  selector: 'app-front-page',
  standalone: true,
  imports: [
    ItemViewComponent,
    HeaderComponent,
    MatSidenavModule,
    DisplayConfigsComponent,
    DirectoryViewComponent,
    FaceViewComponent,
    MatProgressSpinnerModule,
  ],
  templateUrl: './front-page.component.html',
  styleUrl: './front-page.component.scss',
})
export class FrontPageComponent implements OnInit {
  constructor(
    protected displayService: DisplayService,
    protected filesService: FilesService
  ) {
    effect(() => {
      const currentPath = this.filesService.currentPath();
      const subPathFilter = this.filesService.subPathFilter();
      
      if (subPathFilter && subPathFilter !== '' && subPathFilter !== currentPath) {
        this.displayService.displayType.set('item');
      } else {
        this.displayService.displayType.set('folder');
      }
    }, { allowSignalWrites: true });
  }

  ngOnInit(): void {
  }
}
