import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('../app/public/public-routing.module').then(m => m.PublicRoutingModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('../app/features/auth/auth.routing.module').then(m => m.AuthRoutingModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin-routing.module').then(m => m.AdminRoutingModule),
    canActivate: [AuthGuard, AdminGuard] // Protege las rutas admin
  },
 // {
   // path: 'client',
    //loadChildren: () => import('./features/client/client-routing.module').then(m => m.ClientRoutingModule),
    //canActivate: [AuthGuard] // Protege las rutas client para usuarios logueados
  //},
 // { path: '**', redirectTo: '/' } // Redirecciona cualquier ruta no encontrada al componente Home
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
