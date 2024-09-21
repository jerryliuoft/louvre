import { Component, computed, effect, inject, signal } from '@angular/core';
import { FilesService } from '../../services/files.service';
import { NgOptimizedImage } from '@angular/common';
import { DisplayService } from '../../services/display.service';

@Component({
  selector: 'app-body-panel',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './body-panel.component.html',
})
export class BodyPanelComponent {
  currentImages = computed(() => {
    if (this.displayService.pageSize()) {
      const startingIndex =
        this.displayService.pageIndex() * this.displayService.pageSize();
      const endingIndex = startingIndex + this.displayService.pageSize();
      console.log(startingIndex, endingIndex);
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
    this.filesService.setNewDirectory();
  }

  showFile(imageSrc: string) {
    window.electronAPI.showFile(imageSrc);
  }
}
