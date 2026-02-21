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

  filterByFaces() {
    const file = this.file();
    if (file.faceDescriptors && file.faceDescriptors.length > 0) {
       // For MVP: Just use the first face detected as the target filter
       this.filesService.targetFaceDescriptor.set(file.faceDescriptors[0]);
       this.dialogRef.close(); // Close viewer to see the filtered gallery
    }
  }

  async deleteFile() {
    await this.filesService.deleteFile(this.file());
    this.dialogRef.close();
  }
}
