import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DisplayService {
  pageSize = signal(0); // how many images to display
  pageIndex = signal(0); // current page number

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

  constructor() {}
}
