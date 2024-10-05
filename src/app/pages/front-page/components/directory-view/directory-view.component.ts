import { Component, computed, effect, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { FilesService } from '../../../../services/files.service';
import { MediaContainerComponent } from '../../../../components/media-container/media-container.component';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DisplayService } from '../../../../services/display.service';

@Component({
  selector: 'app-directory-view',
  standalone: true,
  imports: [
    NgOptimizedImage,
    MediaContainerComponent,
    RouterLink,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './directory-view.component.html',
  styleUrl: './directory-view.component.scss',
})
export class DirectoryViewComponent {
  private allDirectories = computed(() =>
    Array.from(this.filesService.directoryMap().entries())
  );
  protected currentPage = computed(() => {
    if (this.displayService.pageSize()) {
      const startingIndex =
        this.displayService.pageIndex() * this.displayService.pageSize();
      const endingIndex = startingIndex + this.displayService.pageSize();
      return this.allDirectories().slice(startingIndex, endingIndex);
    }
    return this.allDirectories();
  });

  constructor(
    protected filesService: FilesService,
    protected displayService: DisplayService
  ) {}

  openDir() {
    this.filesService.pickNewDirectory();
  }

  getPreview(parentPath: string, files: string[]) {
    const urls = files.map((file) => {
      return parentPath + '\\' + file;
    });

    return urls.slice(0, 5);
  }
}