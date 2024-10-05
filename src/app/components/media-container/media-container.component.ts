import { NgOptimizedImage } from '@angular/common';
import { Component, computed, input, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DisplayService } from '../../services/display.service';

const SUPPORTED_VIDEO_TYPES = {
  webm: true,
  mp4: true,
  mkv: true,
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
  mediaUrlPath = computed(() => encodeURIComponent(this.mediaSrc()));

  constructor(private displayService: DisplayService) {}

  isImg(url: string) {
    const parts = url.split('.');
    if (parts.length > 1) {
      return !(parts.at(-1)!.toLocaleLowerCase() in SUPPORTED_VIDEO_TYPES);
    }
    return true;
  }
}
