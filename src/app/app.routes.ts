import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'state-demo',
    loadComponent: () => import('./state-demo.component').then(m => m.StateDemoComponent)
  },
  {
    path: 'table-demo',
    loadComponent: () => import('./table-demo.component').then(m => m.TableDemoComponent)
  },
];
