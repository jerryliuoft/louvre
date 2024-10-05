import { Component } from '@angular/core';
import { DisplayService } from '../../../../services/display.service';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-display-configs',
  standalone: true,
  imports: [MatButtonToggleModule, MatExpansionModule, MatRadioModule],
  templateUrl: './display-configs.component.html',
})
export class DisplayConfigsComponent {
  protected pageSizes = [0, 20, 50, 200];
  protected imageSizes = [50, 200, 400, 1000];
  protected previewNum = [5, 10, 15, 0];

  constructor(private displayService: DisplayService) {}
  updateImageHeight(height: number) {
    this.displayService.imageConfigs.update((config) => {
      config.height = height.toString();
      return { ...config };
    });
  }

  changePageSize(size: number) {
    this.displayService.pageSize.set(size);
  }

  updatePreviewSize(size: number) {
    this.displayService.folderPreviewSize.set(size);
  }
}
