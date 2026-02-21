import { Component, computed } from '@angular/core';
import { FilesService } from '../../../../services/files.service';
import { NgOptimizedImage } from '@angular/common';
import { DisplayService } from '../../../../services/display.service';
import { MediaContainerComponent } from '../../../../components/media-container/media-container.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { EmptyStateComponent } from '../empty-state/empty-state.component';

@Component({
  selector: 'app-item-view',
  standalone: true,
  imports: [
    MediaContainerComponent,
    MatIconModule,
    MatButtonModule,
    EmptyStateComponent,
  ],
  templateUrl: './item-view.component.html',
})
export class ItemViewComponent {
  currentImages = computed(() => {
    if (this.displayService.pageSize()) {
      const startingIndex =
        this.displayService.pageIndex() * this.displayService.pageSize();
      const endingIndex = startingIndex + this.displayService.pageSize();
      return this.filesService
        .imagesOrdered()
        .slice(startingIndex, endingIndex);
    }
    return this.filesService.imagesOrdered();
  });

  constructor(
    protected filesService: FilesService,
    protected displayService: DisplayService
  ) {}

  async openFolder() {
    this.filesService.pickNewDirectory();
  }
}
