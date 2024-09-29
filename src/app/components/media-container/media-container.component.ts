import { NgOptimizedImage } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-media-container',
  standalone: true,
  imports: [NgOptimizedImage, RouterLink],
  templateUrl: './media-container.component.html',
  styleUrl: './media-container.component.scss',
})
export class MediaContainerComponent {
  @Input() height!: string;
  @Input() mediaSrc!: string;

  isImg(url: string) {
    if (url.split('.')[1] != 'mp4') {
      return true;
    }
    return false;
  }
}
