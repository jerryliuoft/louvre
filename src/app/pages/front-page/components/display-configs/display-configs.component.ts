import { Component, computed, effect } from '@angular/core';
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
  protected pageSizes = new Map([
    ['no limit', 0],
    ['single', 1],
    ['short', 10],
    ['medium', 50],
    ['long', 200],
  ]);
  protected imageSizes = new Map([
    ['small', '50'],
    ['medium', '200'],
    ['large', '500'],
    ['xLarge', '1000'],
  ]);
  protected previewNum = [5, 10, 15, 0];

  constructor(
    protected displayService: DisplayService
  ) {}

  updateImageHeight(height: string) {
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
