import { Component } from '@angular/core';
import { FilesService, RecentDirectory } from '../../../../services/files.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  template: `
    <div class="flex-column-container align-items-center justify-content-center" style="height: 100%; min-height: 50vh; width: 100%; text-align: center;">
      
      <div class="flex-column-container align-items-center" style="margin-bottom: 3rem;">
        <h2>Welcome to Louvre</h2>
        <div class="flex-container align-items-center" style="color: #888; margin-top: 1rem;">
          Click the <mat-icon style="margin: 0 8px;">folder</mat-icon> icon in the header to pick a folder and get started!
        </div>
      </div>

      @if (filesService.recentDirectories().length > 0) {
        <div class="flex-column-container align-items-center" style="width: 100%; max-width: 400px;">
          <h3 style="color: #888; margin-bottom: 1.5rem;">Recent Folders</h3>
          <div class="flex-column-container" style="width: 100%; gap: 12px;">
            @for (dir of filesService.recentDirectories(); track dir.name) {
              <button mat-stroked-button (click)="resumeFolder(dir)" class="recent-folder-btn" style="width: 100%; height: 50px; display: flex; justify-content: flex-start; align-items: center; padding: 0 16px;">
                <mat-icon style="margin-right: 16px;">folder_open</mat-icon>
                <span class="ellipsis" style="flex: 1; text-align: left;">{{ dir.name }}</span>
              </button>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .text-muted { color: #888; }
    .ellipsis { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: inline-block; max-width: 80%; vertical-align: bottom; }
    .recent-folder-btn ::ng-deep .mat-mdc-button-touch-target { display: none; }
  `]
})
export class EmptyStateComponent {
  constructor(public filesService: FilesService) {}

  resumeFolder(dir: RecentDirectory) {
    this.filesService.loadRecentDirectory(dir.handle);
  }
}
