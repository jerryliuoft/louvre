import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FileSystemService } from '../../services/file-system.service';

@Component({
  selector: 'app-move-folder-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <h2 mat-dialog-title class="flex-container align-items-center gap-sm">
      <mat-icon>edit</mat-icon>
      Move & Rename Folder
    </h2>
    <mat-dialog-content>
      <div style="margin-bottom: 16px; color: rgba(255, 255, 255, 0.7);">
        Moving to: <strong>{{ data.destHandle.name }}</strong>
      </div>

      <mat-form-field appearance="outline" style="width: 100%;">
        <mat-label>New Folder Name</mat-label>
        <input
          matInput
          [(ngModel)]="newName"
          (ngModelChange)="checkExists()"
          placeholder="Enter new name"
          cdkFocusInitial
        />
      </mat-form-field>

      @if (alreadyExists) {
        <div class="warning-box flex-container align-items-center gap-sm">
          <mat-icon style="color: #ff9800;">warning</mat-icon>
          <span
            >A folder with this name already exists in the destination. Contents will be
            merged.</span
          >
        </div>
      }
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-flat-button color="primary" [disabled]="!newName.trim()" (click)="onConfirm()">
        Move
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      :host {
        display: block;
        min-width: 350px;
      }
      .warning-box {
        background-color: rgba(255, 152, 0, 0.1);
        border: 1px solid rgba(255, 152, 0, 0.3);
        padding: 12px;
        border-radius: 8px;
        color: #ffb74d;
        font-size: 14px;
        line-height: 1.4;
      }
    `,
  ],
})
export class MoveFolderDialogComponent implements OnInit {
  public data = inject(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<MoveFolderDialogComponent>);
  private fileSystemService = inject(FileSystemService);

  newName: string = '';
  alreadyExists: boolean = false;

  ngOnInit() {
    this.newName = this.data.folderName;
    this.checkExists();
  }

  async checkExists() {
    if (!this.newName.trim()) {
      this.alreadyExists = false;
      return;
    }
    this.alreadyExists = await this.fileSystemService.exists(
      this.data.destHandle,
      this.newName.trim(),
    );
  }

  onCancel() {
    this.dialogRef.close(null);
  }

  onConfirm() {
    this.dialogRef.close(this.newName.trim());
  }
}
