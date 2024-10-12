import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FilesService } from '../../../../services/files.service';
import { DisplayService } from '../../../../services/display.service';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { RouterLink } from '@angular/router';
import { Location } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    RouterLink,
    MatButtonToggleModule,
  ],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  @Output() toggleMenuEvent = new EventEmitter<void>();
  @Input() currentPath = '';

  constructor(
    protected filesService: FilesService,
    protected displayService: DisplayService,
    protected location: Location
  ) {}
  async selectDirectory() {
    this.filesService.pickNewDirectory();
  }
  showFolder() {
    window.electronAPI.showFile(this.currentPath);
  }

  async randomize() {
    this.filesService.randomize();
  }
  handlePageEvent(event: PageEvent) {
    this.displayService.pageIndex.update((prve) => event.pageIndex);
    this.displayService.pageSize.update((prev) => event.pageSize);
  }
  setDisplayType(type: 'folder' | 'item') {
    this.displayService.displayType.set(type);
    this.displayService.pageIndex.set(0);
  }
}
