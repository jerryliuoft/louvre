import { Component, effect } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { FilesService } from '../../../../services/files.service';

@Component({
  selector: 'app-directory-view',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './directory-view.component.html',
  styleUrl: './directory-view.component.scss',
})
export class DirectoryViewComponent {
  constructor(protected filesService: FilesService) {}
  openDir() {
    this.filesService.setNewDirectory();
  }

  getPreview(parentPath: string, files: string[]) {
    const urls = files.map((file) => {
      return parentPath + '\\' + file;
    });

    return urls.slice(0, 5);
  }
}
