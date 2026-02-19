import { Component, inject, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';

import { Location } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogRef } from '@angular/material/dialog';
import { ModalComponent } from '../../modal/modal.component';

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
  src = input.required();
  dialogRef = inject(MatDialogRef<ModalComponent>);

  showFile() {
    console.warn('Show file not supported in PWA');
  }
}
