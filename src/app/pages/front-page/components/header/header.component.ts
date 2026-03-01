import { Component, EventEmitter, Input, Output, effect, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FilesService } from '../../../../services/files.service';
import { DisplayService } from '../../../../services/display.service';
import { PwaService } from '../../../../services/pwa.service';
import { MatPaginatorModule, PageEvent, MatPaginator } from '@angular/material/paginator';
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
  @ViewChild(MatPaginator) paginator?: MatPaginator;

  constructor(
    protected filesService: FilesService,
    protected displayService: DisplayService,
    public pwaService: PwaService,
  ) {
    effect(() => {
      // depend on the subPathFilter and currentPath to run when directory changes
      const subPath = this.filesService.subPathFilter();
      const currentPath = this.filesService.currentPath();

      // Ensure the paginator visually resets to 0
      if (this.paginator) {
        this.paginator.pageIndex = 0;
      }

      // Scroll to top when directory changes
      const container =
        document.querySelector('mat-sidenav-content') ||
        document.querySelector('.mat-drawer-content');
      if (container) {
        container.scrollTo({ top: 0, behavior: 'instant' });
      } else {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    });
  }
  async selectDirectory() {
    this.filesService.pickNewDirectory();
  }
  async randomize() {
    this.filesService.randomize();
  }
  handlePageEvent(event: PageEvent) {
    this.displayService.pageIndex.update((prev) => event.pageIndex);
    this.displayService.pageSize.update((prev) => event.pageSize);

    // Scroll the content container back to the top
    const container =
      document.querySelector('mat-sidenav-content') ||
      document.querySelector('.mat-drawer-content');
    if (container) {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
  setDisplayType(type: 'folder' | 'item' | 'faces') {
    this.displayService.displayType.set(type);
    this.displayService.pageIndex.set(0);
  }

  clearFaceFilter() {
    this.filesService.targetFaceDescriptor.set(null);
    this.setDisplayType('folder');
  }
}
