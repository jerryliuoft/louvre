import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../pages/image-view/modal/modal.component';

@Injectable({
  providedIn: 'root',
})
export class ImageViewService {
  readonly dialog = inject(MatDialog);

  openDialog(filePath: string): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      data: { filePath },
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%',
    });

    // dialogRef.afterClosed().subscribe((result) => {
    //   console.log('The dialog was closed');
    //   if (result !== undefined) {
    //     this.animal.set(result);
    //   }
    // });
  }
}
