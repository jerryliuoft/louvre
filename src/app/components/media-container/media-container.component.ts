import { Component, computed, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
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
  imports: [RouterLink, MatIconModule],
  templateUrl: './media-container.component.html',
  styleUrl: './media-container.component.scss',
})
export class MediaContainerComponent {
  height = computed(() => this.displayService.imageConfigs().height);
  file = input.required<FileWithType>();
  showButton = signal(false);
  isVisible = signal(true);

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

  showFile() {
    // Not supported in PWA
    console.warn('Show file in explorer not supported in PWA');
  }

  async deleteFile() {
    await this.filesService.deleteFile(this.file());
    this.isVisible.set(false);
  }
}
