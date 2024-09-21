import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FilesService } from '../../services/files.service';
import { DisplayService } from '../../services/display.service';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
  ],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  constructor(
    protected filesService: FilesService,
    protected displayService: DisplayService
  ) {}
  async selectDirectory() {
    this.filesService.setNewDirectory();
  }
  async randomize() {
    this.filesService.randomizeImages();
  }
  handlePageEvent(event: PageEvent) {
    this.displayService.pageIndex.update((prve) => event.pageIndex);
    this.displayService.pageSize.update((prev) => event.pageSize);
  }
}
