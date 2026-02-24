import { Component, inject } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { FilesService } from '../../services/files.service';

@Component({
  selector: 'app-move-progress-dialog',
  standalone: true,
  imports: [MatDialogModule, MatProgressBarModule, MatIconModule],
  template: `
    <h2 mat-dialog-title class="flex-container align-items-center gap-sm">
      <mat-icon>drive_file_move</mat-icon>
      Moving Folder
    </h2>
    <mat-dialog-content>
      <div style="margin-bottom: 16px;">
        <strong>From:</strong> {{ filesService.currentPath() }}<br />
        <strong>Folder:</strong> {{ filesService.currentFolderName() }}
      </div>

      @if (filesService.moveProgress(); as progress) {
        <div style="margin-bottom: 8px; display: flex; justify-content: space-between;">
          <span>Processing files...</span>
          <span>{{ progress.current }} / {{ progress.total }}</span>
        </div>
        @if (progress.total > 0) {
          <mat-progress-bar
            mode="determinate"
            [value]="(progress.current / progress.total) * 100"
          ></mat-progress-bar>
        } @else {
          <mat-progress-bar mode="indeterminate"></mat-progress-bar>
        }
      } @else {
        <div style="margin-bottom: 8px;">Preparing move...</div>
        <mat-progress-bar mode="indeterminate"></mat-progress-bar>
      }
    </mat-dialog-content>
  `,
  styles: [
    `
      :host {
        display: block;
        min-width: 320px;
      }
      mat-dialog-content {
        color: rgba(255, 255, 255, 0.87);
      }
    `,
  ],
})
export class MoveProgressDialogComponent {
  filesService = inject(FilesService);
}
