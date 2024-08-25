import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  async onLogin() {
    try {
      await this.authService.loginWithEmail(this.email, this.password);
      this.authService.isAdmin().subscribe(isAdmin => {
        if (isAdmin) {
          this.router.navigate(['/admin']);
        } else {
          this.authService.isClient().subscribe(isClient => {
            if (isClient) {
              this.router.navigate(['/events']);
            } else {
              Swal.fire('Error', 'Rol de usuario no reconocido', 'error');
            }
          });
        }
      });
    } catch (error) {
      Swal.fire('Error', 'Credenciales inválidas', 'error');
    }
  }

  onRegister() {
    this.router.navigate(['/auth/register']);
  }
}
