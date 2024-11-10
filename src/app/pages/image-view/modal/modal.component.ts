import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ImageViewComponent } from '../image-view.component';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [ImageViewComponent],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent {
  readonly data = inject(MAT_DIALOG_DATA);
}
