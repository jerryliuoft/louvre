import { Component } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import { DisplayService } from '../../services/display.service';

@Component({
  selector: 'app-display-configs',
  standalone: true,
  imports: [MatSliderModule],
  templateUrl: './display-configs.component.html',
})
export class DisplayConfigsComponent {
  constructor(private displayService: DisplayService) {}
  updateImageHeight(height: number) {
    console.log(height);
    this.displayService.imageConfigs.update((config) => {
      config.height = height.toString();
      return { ...config };
    });
  }
}
