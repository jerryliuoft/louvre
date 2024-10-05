import { Routes } from '@angular/router';
import { FrontPageComponent } from './pages/front-page/front-page.component';
import { ImageViewComponent } from './pages/image-view/image-view.component';

export const routes: Routes = [
  {
    path: '',
    title: 'Louvre - your own gallery',
    component: FrontPageComponent,
  },
  {
    path: 'image/:src',
    title: 'Image',
    component: ImageViewComponent,
  },
  {
    path: 'folder/:path',
    title: 'Louvre - your own gallery',
    component: FrontPageComponent,
  },
];
