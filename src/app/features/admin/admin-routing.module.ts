import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReservasComponent } from './reservas/reservas.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { ConfiguracionComponent } from './configuracion/configuracion.component';
import { GestionEventosComponent } from './gestion-eventos/gestion-eventos.component';
import { ModalNotificacionComponent } from './modal-notificacion/modal-notificacion.component';
import { ReporteClienteComponent } from './reports/reporte-cliente/reporte-cliente.component';
import { ReporteEventosComponent } from './reports/reporte-eventos/reporte-eventos.component';
import { ReporteReservaComponent } from './reports/reporte-reserva/reporte-reserva.component';
import { ReporteServicioComponent } from './reports/reporte-servicio/reporte-servicio.component';

const routes: Routes = [
  {
    path: '', 
    component: DashboardComponent,
    children: [
      { path: 'dashboard', redirectTo: '', pathMatch: 'full' }, // Redirigir al componente de reservas por defecto
      { path: 'reservas', component: ReservasComponent }, // Gestión de reservas
      { path: 'usuarios', component: UsuariosComponent }, // Gestión de usuarios
      { path: 'configuracion', component: ConfiguracionComponent }, // Configuración
      { path: 'gestion-eventos', component: GestionEventosComponent }, // Gestión de eventos
      { path: 'notificaciones', component: ModalNotificacionComponent }, // Gestión de notificaciones
      {
        path: 'reportes', // Subruta para reportes
        children: [
          { path: 'clientes', component: ReporteClienteComponent }, // Reporte de clientes
          { path: 'eventos', component: ReporteEventosComponent }, // Reporte de eventos
          { path: 'reservas', component: ReporteReservaComponent }, // Reporte de reservas
          { path: 'servicios', component: ReporteServicioComponent } // Reporte de servicios
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
