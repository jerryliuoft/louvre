import { Component, computed, effect, signal } from '@angular/core';

import { FilesService } from '../../../../services/files.service';
import { MediaContainerComponent } from '../../../../components/media-container/media-container.component';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DisplayService } from '../../../../services/display.service';
import { DirectoryChipsComponent } from "../directory-chips/directory-chips.component";
import { FileWithType } from '../../../../models/file.model';
import { EmptyStateComponent } from '../empty-state/empty-state.component';

@Component({
  selector: 'app-directory-view',
  standalone: true,
  imports: [
    MediaContainerComponent,
    MatIconModule,
    MatButtonModule,
    DirectoryChipsComponent,
    EmptyStateComponent,
],
  templateUrl: './directory-view.component.html',
  styleUrl: './directory-view.component.scss',
})
export class DirectoryViewComponent {
  protected currentPage = computed(() => {
    if (this.displayService.pageSize()) {
      const startingIndex =
        this.displayService.pageIndex() * this.displayService.pageSize();
      const endingIndex = startingIndex + this.displayService.pageSize();
      return this.filesService
        .displayedDirectories()
        .slice(startingIndex, endingIndex);
    }
    return this.filesService.displayedDirectories();
  });

  constructor(
    protected filesService: FilesService,
    protected displayService: DisplayService
  ) {}

  openDir() {
    this.filesService.pickNewDirectory();
  }

  getPreview(parentPath: string, files: FileWithType[]) {
    if (this.displayService.folderPreviewSize()) {
      return files.slice(0, this.displayService.folderPreviewSize());
    }
    return files;
  }
}
