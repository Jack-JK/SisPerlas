import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  model = {
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    telefono: ''
  };

  constructor(private authService: AuthService, private router: Router) {}

  async onSubmit() {
    if (this.model.email && this.model.password) {
      try {
        await this.authService.registerWithEmail(
          this.model.email,
          this.model.password,
          this.model.nombre,
          this.model.apellido,
          this.model.telefono
        );
        Swal.fire({
          title: 'Registro Exitoso!',
          text: 'Te has registrado con éxito.',
          icon: 'success',
          confirmButtonText: 'Ir a Inicio de Sesión'
        }).then((result) => {
          if (result.isConfirmed) {
            this.router.navigate(['/auth/login']);
          }
        });
      } catch (error) {
        Swal.fire({
          title: 'Error en el Registro',
          text: 'Hubo un problema al intentar registrar tu cuenta. Por favor, inténtalo de nuevo.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
        console.error('Error en el registro:', error);
      }
    }
  }

  goToLogin() {
    this.router.navigate(['/auth/login']);
  }
}
