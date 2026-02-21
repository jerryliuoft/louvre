import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FilesService } from '../../../../services/files.service';
import { DisplayService } from '../../../../services/display.service';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Location } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatButtonToggleModule,
    MatMenuModule,
    MatDividerModule,
    MatTooltipModule,
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
    this.filesService.randomize();
  }
  handlePageEvent(event: PageEvent) {
    this.displayService.pageIndex.update((prev) => event.pageIndex);
    this.displayService.pageSize.update((prev) => event.pageSize);
  }
  setDisplayType(type: 'folder' | 'item' | 'faces') {
    this.displayService.displayType.set(type);
    this.displayService.pageIndex.set(0);
  }
}
