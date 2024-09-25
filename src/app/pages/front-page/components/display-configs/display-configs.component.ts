import { Component } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { DisplayService } from '../../../../services/display.service';

@Component({
  selector: 'app-display-configs',
  standalone: true,
  imports: [MatSliderModule, MatListModule, MatDividerModule],
  templateUrl: './display-configs.component.html',
})
export class DisplayConfigsComponent {
  constructor(private DisplayService: DisplayService) {}
  updateImageHeight(height: number) {
    console.log(height);
    this.DisplayService.imageConfigs.update((config) => {
      config.height = height.toString();
      return { ...config };
    });
  }
}
