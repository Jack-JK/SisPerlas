import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from '../environments/environment';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { DashboardComponent } from './features/admin/dashboard/dashboard.component';
import { HomeComponent } from './public/home/home.component';
import { AboutComponent } from './public/about/about.component';
import { EventComponent } from './public/event/event.component';
import { ReservaComponent } from './public/reserva/reserva.component';
import { ReservasComponent } from './features/admin/reservas/reservas.component';
import { UsuariosComponent } from './features/admin/usuarios/usuarios.component';
import { ServicioDirective } from './core/services/servicio.directive';
import { ModalNotificacionComponent } from './features/admin/modal-notificacion/modal-notificacion.component';
import { ConfiguracionComponent } from './features/admin/configuracion/configuracion.component';
import { GestionEventosComponent } from './features/admin/gestion-eventos/gestion-eventos.component';
import { ReporteEventosComponent } from './features/admin/reports/reporte-eventos/reporte-eventos.component';
import { ReporteReservaComponent } from './features/admin/reports/reporte-reserva/reporte-reserva.component';
import { ReporteServicioComponent } from './features/admin/reports/reporte-servicio/reporte-servicio.component';
import { ReporteClienteComponent } from './features/admin/reports/reporte-cliente/reporte-cliente.component';
import { CalendarioComponent } from './features/admin/reports/calendario/calendario.component';
import { FullCalendarModule } from '@fullcalendar/angular'; // Importar FullCalendarModule
import dayGridPlugin from '@fullcalendar/daygrid'; // Importa el plugin dayGrid

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    HomeComponent,
    AboutComponent,
    EventComponent,
    ReservaComponent,
    ReservasComponent,
    UsuariosComponent,
    ServicioDirective,
    ModalNotificacionComponent,
    ConfiguracionComponent,
    GestionEventosComponent,
    ReporteEventosComponent,
    ReporteReservaComponent,
    ReporteServicioComponent,
    ReporteClienteComponent,
    CalendarioComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FullCalendarModule, // Agregar FullCalendarModule a los imports
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
