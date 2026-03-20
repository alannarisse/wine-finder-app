import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'admin/login',
    loadComponent: () => import('./components/admin-login/admin-login.component').then(m => m.AdminLoginComponent)
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin.component').then(m => m.AdminComponent),
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
