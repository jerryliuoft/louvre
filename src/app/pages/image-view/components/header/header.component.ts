import { Component, inject, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';

import { Location } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogRef } from '@angular/material/dialog';
import { ModalComponent } from '../../modal/modal.component';
import { FileWithType } from '../../../../models/file.model';
import { FilesService } from '../../../../services/files.service';

@Component({
  selector: 'img-header',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  file = input.required<FileWithType>();
  dialogRef = inject(MatDialogRef<ModalComponent>);
  filesService = inject(FilesService);

  goToFolder() {
    this.filesService.goToFolder(this.file());
    this.dialogRef.close();
  }

  async deleteFile() {
    await this.filesService.deleteFile(this.file());
    this.dialogRef.close();
  }
}
