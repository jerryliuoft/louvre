import { Component } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { DisplayService } from '../../../../services/display.service';
import {
  MatButtonToggleChange,
  MatButtonToggleModule,
} from '@angular/material/button-toggle';

@Component({
  selector: 'app-display-configs',
  standalone: true,
  imports: [
    MatSliderModule,
    MatListModule,
    MatDividerModule,
    MatButtonToggleModule,
  ],
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

  changeDisplayType(event: MatButtonToggleChange) {
    this.DisplayService.displayType.set(event.value);
  }
}
