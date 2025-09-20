import { NgOptimizedImage } from '@angular/common';
import { Component, computed, effect, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DisplayService } from '../../services/display.service';
import { ImageViewService } from '../../services/image-view.service';
import { MatIconModule } from '@angular/material/icon';

const SUPPORTED_VIDEO_TYPES = {
  webm: true,
  mp4: true,
  mkv: true,
  ogg: true,
  mov: true,
};

@Component({
  selector: 'app-media-container',
  standalone: true,
  imports: [NgOptimizedImage, RouterLink, MatIconModule],
  templateUrl: './media-container.component.html',
  styleUrl: './media-container.component.scss',
})
export class MediaContainerComponent {
  height = computed(() => this.displayService.imageConfigs().height);
  mediaSrc = input.required<string>();
  showButton = signal(false);
  isVisible = signal(true);

  constructor(
    private displayService: DisplayService,
    protected imageViewService: ImageViewService
  ) {}

  isImg(url: string) {
    const parts = url.split('.');
    if (parts.length > 1) {
      return !(parts.at(-1)!.toLocaleLowerCase() in SUPPORTED_VIDEO_TYPES);
    }
    return true;
  }

  showFile() {
    window.electronAPI.showFile(this.mediaSrc());
  }

  deleteFile() {
    window.electronAPI.deleteFile(this.mediaSrc());
    this.isVisible.set(false);
  }
}
