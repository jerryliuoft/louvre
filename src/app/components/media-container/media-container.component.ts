import { NgOptimizedImage } from '@angular/common';
import { Component, computed, effect, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DisplayService } from '../../services/display.service';
import { ImageViewService } from '../../services/image-view.service';

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
  imports: [NgOptimizedImage, RouterLink],
  templateUrl: './media-container.component.html',
  styleUrl: './media-container.component.scss',
})
export class MediaContainerComponent {
  height = computed(() => this.displayService.imageConfigs().height);
  mediaSrc = input.required<string>();
  // Uncomment this once we solved the problem with electron not able to render image on new window
  // mediaUrlPath = computed(() => encodeURIComponent(this.mediaSrc()));

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
}
