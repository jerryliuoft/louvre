import { Component } from '@angular/core';
import { FilesService } from '../../../../services/files.service';
import { DisplayService } from '../../../../services/display.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FaceThumbnailComponent } from '../../../../components/face-thumbnail/face-thumbnail.component';
import { ObjectUrlPipe } from '../../../../pipes/object-url.pipe';

@Component({
  selector: 'app-face-view',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    FaceThumbnailComponent,
    ObjectUrlPipe
  ],
  templateUrl: './face-view.html',
  styleUrls: ['./face-view.scss']
})
export class FaceViewComponent {
  constructor(
    public filesService: FilesService,
    public displayService: DisplayService
  ) {}

  selectFace(descriptor: Float32Array) {
    this.filesService.targetFaceDescriptor.set(descriptor);
    this.displayService.displayType.set('item');
    this.displayService.pageIndex.set(0);
  }
}
