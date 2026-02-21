import { Component, computed, inject, input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { FilesService } from '../../../../services/files.service';

@Component({
  selector: 'app-directory-chips',
  standalone: true,
  imports: [MatChipsModule, MatIconModule],
  templateUrl: './directory-chips.component.html',
  styleUrl: './directory-chips.component.scss',
})
export class DirectoryChipsComponent {
  path = input<string>('');
  filesService = inject(FilesService);
  
  protected parsedPaths = computed(() => {
    // change 1/2/3 to an array [1, 1/2, 1/2/3]

    const cur_path = this.path();
    const paths = [];
    let i = 1;
    while ((i = cur_path.indexOf('/', i) + 1)) {
      paths.push(cur_path.substring(0, i - 1));
    }
    paths.push(cur_path);
    const result = paths.filter(p => p !== '');
    return result.length ? result : ['/'];
  });

  getChipTitle(folder_path: string) {
    if (folder_path === '/') return 'Root';
    
    // Remove trailing slash if present before splitting
    const cleanPath = folder_path.endsWith('/') ? folder_path.slice(0, -1) : folder_path;
    return cleanPath.split('/').pop() || cleanPath;
  }

  goToDirectory(folder_path: string) {
    this.filesService.setNewDirectory(folder_path);
  }
}

