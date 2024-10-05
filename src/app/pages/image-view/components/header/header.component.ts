import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'img-header',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  @Input({ required: true }) src = '';

  constructor(protected location: Location) {}

  showFile() {
    window.electronAPI.showFile(this.src);
  }
}
