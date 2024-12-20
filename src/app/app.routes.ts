import { Routes } from '@angular/router';
import { FrontPageComponent } from './pages/front-page/front-page.component';

export const routes: Routes = [
  {
    path: '',
    title: 'Louvre - your own gallery',
    component: FrontPageComponent,
  },
  {
    path: 'folder/:path',
    title: 'Louvre - your own gallery',
    component: FrontPageComponent,
  },
];
