import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-protected-directory-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './protected-directory-dialog.component.html',
  styleUrl: './protected-directory-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProtectedDirectoryDialogComponent {}
