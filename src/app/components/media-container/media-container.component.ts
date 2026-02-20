import { Component, computed, input, signal } from '@angular/core';

import { DisplayService } from '../../services/display.service';
import { ImageViewService } from '../../services/image-view.service';
import { MatIconModule } from '@angular/material/icon';
import { FilesService } from '../../services/files.service';
import { FileWithType } from '../../models/file.model';

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
  imports: [MatIconModule],
  templateUrl: './media-container.component.html',
  styleUrl: './media-container.component.scss',
})
export class MediaContainerComponent {
  height = computed(() => this.displayService.imageConfigs().height);
  file = input.required<FileWithType>();

  constructor(
    private displayService: DisplayService,
    protected imageViewService: ImageViewService,
    private filesService: FilesService
  ) {}

  isImg() {
    const parts = this.file().name.split('.');
    if (parts.length > 1) {
      return !(parts.at(-1)!.toLocaleLowerCase() in SUPPORTED_VIDEO_TYPES);
    }
    return true;
  }
}
