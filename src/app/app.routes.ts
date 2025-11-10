import { Routes } from '@angular/router';
import { HomePage } from './page/home-page/home-page';
import { NoticiasPage } from './page/noticias-page/noticias-page';
import { DetalleNoticiaPage } from './page/detalle-noticia-page/detalle-noticia-page';
import { LoginPage } from './page/login-page/login-page';
import { PerfilPage } from './page/perfil-page/perfil-page';
import { CmsPage } from './page/cms-page/cms-page';
import { AdminPage } from './page/admin-page/admin-page';
import { cmsGuard } from './auth/cms.guard';
import { adminGuard } from './auth/admin.guard';

export const routes: Routes = [
  {
    path: 'home',
    component: HomePage
  },
  {
    path: 'noticias',
    component: NoticiasPage
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'detalle-noticia/:id',
    component: DetalleNoticiaPage
  },
  {
    path: 'login',
    component: LoginPage
  },
  {
    path: 'perfil',
    component: PerfilPage
  },
  {
    path: 'cms',
    component: CmsPage,
    canActivate: [cmsGuard]
  },
  {
    path: 'admin',
    component: AdminPage,
    canActivate: [adminGuard]
  },
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full'
  }
];
