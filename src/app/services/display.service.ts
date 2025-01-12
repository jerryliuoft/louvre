import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DisplayService {
  pageSize = signal(50); // how many images to display
  pageIndex = signal(0); // current page number
  folderPreviewSize = signal(5); // Number of images to show on the folder preview

  // configurations for the images
  imageConfigs = signal<{
    width: string;
    height: string;
    loading: 'auto' | 'lazy' | 'eager' | undefined;
  }>({
    width: 'auto',
    height: '200',
    loading: 'lazy',
  });

  displayType = signal<'item' | 'folder'>('folder');

  constructor() {
    effect(() => {
      const config = {
        imageConfigs: this.imageConfigs(),
        pageSize: this.pageSize(),
        folderPreviewSize: this.folderPreviewSize(),
      };
      localStorage.setItem('displayService', JSON.stringify(config));
    });

    const prevJSONConfig = localStorage.getItem('displayService');
    if (prevJSONConfig) {
      const config = JSON.parse(prevJSONConfig);
      this.pageSize.set(config.pageSize);
      this.folderPreviewSize.set(config.folderPreviewSize);
      this.imageConfigs.set(config.imageConfigs);
    }
  }
}
