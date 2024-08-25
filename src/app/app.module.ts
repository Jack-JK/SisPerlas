import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Importación para formularios
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth'; // Importación para autenticación
import { AngularFirestoreModule } from '@angular/fire/compat/firestore'; // Importación para Firestore
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
    ServicioDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule, // Importación para ngModel
    ReactiveFormsModule, // Importación para formularios reactivos
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule, // Importación para autenticación con Firebase
    AngularFirestoreModule // Importación para Firestore de Firebase
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
