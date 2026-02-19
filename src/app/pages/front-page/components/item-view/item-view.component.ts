import { Component, computed } from '@angular/core';
import { FilesService } from '../../../../services/files.service';
import { NgOptimizedImage } from '@angular/common';
import { DisplayService } from '../../../../services/display.service';
import { RouterLink } from '@angular/router';
import { MediaContainerComponent } from '../../../../components/media-container/media-container.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-item-view',
  standalone: true,
  imports: [
    MediaContainerComponent,
    MatIconModule,
  ],
  templateUrl: './item-view.component.html',
})
export class BodyPanelComponent {
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
