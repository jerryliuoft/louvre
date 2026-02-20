import { Component, computed, input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-directory-chips',
  standalone: true,
  imports: [MatChipsModule, RouterLink],
  templateUrl: './directory-chips.component.html',
  styleUrl: './directory-chips.component.scss',
})
export class DirectoryChipsComponent {
  path = input<string>('');
  protected parsedPaths = computed(() => {
    // change 1/2/3 to an array [1, 1/2, 1/2/3]

    const cur_path = this.path();
    const paths = [];
    let i = 1;
    while ((i = cur_path.indexOf('/', i) + 1)) {
      paths.push(cur_path.substring(0, i - 1));
    }
    paths.push(cur_path);
    return paths;
  });

  getChipTitle(folder_path: string) {
    // we only need to display the last part of the path so just pop it out;
    return folder_path.split('/').pop();
  }

  encodePath(folder_path: string) {
    return encodeURIComponent(folder_path);
  }
}
