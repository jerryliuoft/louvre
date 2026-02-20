import { Component, inject, signal, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ImageViewComponent } from '../image-view.component';
import { FilesService } from '../../../services/files.service';
import { FileWithType } from '../../../models/file.model';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgClass } from '@angular/common';
import { ObjectUrlPipe } from '../../../pipes/object-url.pipe';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [ImageViewComponent, MatButtonModule, MatIconModule, NgClass, ObjectUrlPipe],
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
  
  get filmstripWindow(): FileWithType[] {
    const files = this.filesService.files_original();
    const current = this.currentFile();
    if (!current) return [];
    
    const idx = files.findIndex((f: FileWithType) => f.path === current.path);
    if (idx === -1) return [];
    
    // Create a sliding window of 9 items total (current +/- 4)
    const start = Math.max(0, idx - 4);
    const end = Math.min(files.length, idx + 5);
    return files.slice(start, end);
  }

  isVideo(file: FileWithType) {
    const parts = file.name.split('.');
    const SUPPORTED_VIDEO_TYPES: any = { webm: true, mp4: true, mkv: true, ogg: true, mov: true };
    if (parts.length > 1) {
      return (parts.at(-1)!.toLocaleLowerCase() in SUPPORTED_VIDEO_TYPES);
    }
    return false;
  }
  
  hasPrev() {
    const files = this.filesService.files_original();
    const idx = files.findIndex((f: FileWithType) => f.path === this.currentFile()?.path);
    return idx > 0;
  }
  
  hasNext() {
    const files = this.filesService.files_original();
    const idx = files.findIndex((f: FileWithType) => f.path === this.currentFile()?.path);
    return idx >= 0 && idx < files.length - 1;
  }
  
  prev() {
    const files = this.filesService.files_original();
    const idx = files.findIndex((f: FileWithType) => f.path === this.currentFile()?.path);
    if (idx > 0) {
      this.currentFile.set(files[idx - 1]);
    }
  }
  
  next() {
    const files = this.filesService.files_original();
    const idx = files.findIndex((f: FileWithType) => f.path === this.currentFile()?.path);
    if (idx >= 0 && idx < files.length - 1) {
      this.currentFile.set(files[idx + 1]);
    }
  }
}
