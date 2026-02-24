import { Component, computed } from '@angular/core';

import { FilesService } from '../../../../services/files.service';
import { MediaContainerComponent } from '../../../../components/media-container/media-container.component';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DisplayService } from '../../../../services/display.service';
import { DirectoryChipsComponent } from '../directory-chips/directory-chips.component';
import { FileWithType } from '../../../../models/file.model';
import { EmptyStateComponent } from '../empty-state/empty-state.component';
import { GenericFileItemComponent } from '../../../../components/generic-file-item/generic-file-item.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-directory-view',
  standalone: true,
  imports: [
    MediaContainerComponent,
    MatIconModule,
    MatButtonModule,
    DirectoryChipsComponent,
    EmptyStateComponent,
    GenericFileItemComponent,
    MatTooltipModule,
  ],
  templateUrl: './directory-view.component.html',
  styleUrl: './directory-view.component.scss',
})
export class DirectoryViewComponent {
  protected currentPage = computed(() => {
    if (this.displayService.pageSize()) {
      const startingIndex = this.displayService.pageIndex() * this.displayService.pageSize();
      const endingIndex = startingIndex + this.displayService.pageSize();
      return this.filesService.displayedDirectories().slice(startingIndex, endingIndex);
    }
    return this.filesService.displayedDirectories();
  });

  constructor(
    protected filesService: FilesService,
    protected displayService: DisplayService,
  ) {}

  getMediaPreview(files: FileWithType[]) {
    const media = files.filter((f) => this.filesService.isMedia(f.name));
    if (this.displayService.folderPreviewSize()) {
      return media.slice(0, this.displayService.folderPreviewSize());
    }
    return media;
  }

  getOthers(files: FileWithType[]) {
    return files.filter((f) => !this.filesService.isMedia(f.name));
  }

  async deleteFolder(folderPath: string) {
    const folderName = folderPath.split('/').pop() || folderPath;
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete the folder "${folderName}" and all its contents? This cannot be undone.`,
    );
    if (!confirmed) return;
    await this.filesService.deleteFolder(folderPath);
  }
}
