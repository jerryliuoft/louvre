import { Routes } from '@angular/router';
import { FrontPageComponent } from './pages/front-page/front-page.component';

export const routes: Routes = [
  {
    path: '',
    title: 'Louve - your own gallery',
    component: FrontPageComponent,
  },
  {
    //TODO: open images in separate window
    path: 'image',
    title: 'Image',
    component: FrontPageComponent,
  },
];
