import { Component, inject, signal, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ImageViewComponent } from '../image-view.component';
import { FilesService } from '../../../services/files.service';
import { FileWithType } from '../../../models/file.model';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [ImageViewComponent, MatButtonModule, MatIconModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent implements OnInit {
  readonly data = inject<{ file: FileWithType }>(MAT_DIALOG_DATA);
  readonly filesService = inject(FilesService);
  
  currentFile = signal<FileWithType | null>(null);
  
  ngOnInit() {
    this.currentFile.set(this.data.file);
  }
  
  hasPrev() {
    const files = this.filesService.imagesOrdered();
    const idx = files.findIndex((f: FileWithType) => f.url === this.currentFile()?.url);
    return idx > 0;
  }
  
  hasNext() {
    const files = this.filesService.imagesOrdered();
    const idx = files.findIndex((f: FileWithType) => f.url === this.currentFile()?.url);
    return idx >= 0 && idx < files.length - 1;
  }
  
  prev() {
    const files = this.filesService.imagesOrdered();
    const idx = files.findIndex((f: FileWithType) => f.url === this.currentFile()?.url);
    if (idx > 0) {
      this.currentFile.set(files[idx - 1]);
    }
  }
  
  next() {
    const files = this.filesService.imagesOrdered();
    const idx = files.findIndex((f: FileWithType) => f.url === this.currentFile()?.url);
    if (idx >= 0 && idx < files.length - 1) {
      this.currentFile.set(files[idx + 1]);
    }
  }
}
