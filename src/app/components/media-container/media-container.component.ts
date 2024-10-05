import { NgOptimizedImage } from '@angular/common';
import { Component, computed, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DisplayService } from '../../services/display.service';

@Component({
  selector: 'app-media-container',
  standalone: true,
  imports: [NgOptimizedImage, RouterLink],
  templateUrl: './media-container.component.html',
  styleUrl: './media-container.component.scss',
})
export class MediaContainerComponent {
  height = computed(() => this.displayService.imageConfigs().height);
  @Input() mediaSrc!: string;

  constructor(private displayService: DisplayService) {}

  isImg(url: string) {
    if (url.split('.')[1] != 'mp4') {
      return true;
    }
    return false;
  }
}
