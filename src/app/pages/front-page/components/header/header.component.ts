import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FilesService } from '../../../../services/files.service';
import { DisplayService } from '../../../../services/display.service';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { RouterLink } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    RouterLink,
  ],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  @Output() toggleMenuEvent = new EventEmitter<void>();

  constructor(
    protected filesService: FilesService,
    protected displayService: DisplayService,
    protected location: Location
  ) {}
  async selectDirectory() {
    this.filesService.pickNewDirectory();
  }
  async randomize() {
    this.filesService.randomizeImages();
  }
  handlePageEvent(event: PageEvent) {
    this.displayService.pageIndex.update((prve) => event.pageIndex);
    this.displayService.pageSize.update((prev) => event.pageSize);
  }
}
