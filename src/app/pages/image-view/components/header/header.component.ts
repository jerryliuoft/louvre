import { Component, inject, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';

import { Location } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogRef } from '@angular/material/dialog';
import { ModalComponent } from '../../modal/modal.component';
import { FileWithType } from '../../../../models/file.model';
import { FilesService } from '../../../../services/files.service';
import { FaceThumbnailComponent } from '../../../../components/face-thumbnail/face-thumbnail.component';

@Component({
  selector: 'img-header',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatMenuModule,
    FaceThumbnailComponent
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

  filterByFaces(descriptor: Float32Array) {
    this.filesService.targetFaceDescriptor.set(descriptor);
    this.dialogRef.close(); // Close viewer to see the filtered gallery
  }

  async deleteFile() {
    await this.filesService.deleteFile(this.file());
    this.dialogRef.close();
  }
}
