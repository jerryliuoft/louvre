import { Component, input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FileWithType } from '../../models/file.model';
import { FilesService } from '../../services/files.service';

@Component({
  selector: 'app-generic-file-item',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule],
  template: `
    <div
      class="file-item flex-container flex-column align-items-center gap-xs"
      [matTooltip]="file().name"
    >
      <div class="icon-container flex-container align-items-center justify-content-center">
        <mat-icon class="file-icon">{{ getIcon() }}</mat-icon>
      </div>
      <span class="file-name">{{ file().name }}</span>
    </div>
  `,
  styles: [
    `
      .file-item {
        width: 120px;
        padding: 12px;
        border-radius: 12px;
        background-color: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        cursor: pointer;
      }
      .file-item:hover {
        background-color: rgba(255, 255, 255, 0.12);
        border-color: rgba(255, 255, 255, 0.2);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      }
      .icon-container {
        width: 64px;
        height: 64px;
        background-color: rgba(255, 255, 255, 0.03);
        border-radius: 50%;
        margin-bottom: 4px;
      }
      .file-icon {
        font-size: 32px;
        width: 32px;
        height: 32px;
        color: rgba(255, 255, 255, 0.6);
      }
      .file-item:hover .file-icon {
        color: var(--primary-color, #4db6ac);
      }
      .file-name {
        font-size: 13px;
        font-weight: 500;
        text-align: center;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: rgba(255, 255, 255, 0.85);
      }
    `,
  ],
})
export class GenericFileItemComponent {
  file = input.required<FileWithType>();
  private filesService = inject(FilesService);

  getIcon(): string {
    const ext = this.file().name.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf':
        return 'picture_as_pdf';
      case 'doc':
      case 'docx':
      case 'txt':
      case 'rtf':
      case 'md':
        return 'description';
      case 'xls':
      case 'xlsx':
      case 'csv':
        return 'table_chart';
      case 'zip':
      case 'rar':
      case '7z':
      case 'tar':
      case 'gz':
        return 'inventory_2';
      case 'json':
      case 'xml':
      case 'js':
      case 'ts':
      case 'py':
      case 'java':
        return 'code';
      default:
        return 'insert_drive_file';
    }
  }
}
