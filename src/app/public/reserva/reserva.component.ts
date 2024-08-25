import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Evento } from '../../core/models/event.model';
import { Servicio } from '../../core/models/servicio.model';
import { Usuario } from '../../core/models/user.model';
import { ReservaService } from '../../core/services/reserva.service';
import { AuthService } from '../../core/services/auth.service';
import { ProcesaReservaService } from '../../core/services/procesa-reserva.service';
import { Reserva } from '../../core/models/reservation.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reserva',
  templateUrl: './reserva.component.html',
  styleUrls: ['./reserva.component.css']
})
export class ReservaComponent implements OnInit {
  evento$!: Observable<Evento | undefined>;
  servicios$!: Observable<Servicio[]>;
  usuarioActual$: Observable<Usuario | null>;
  total$!: Observable<number>;
  totalFormatted: string = '';

  // Formulario
  fecha: string = '';
  hora: string = '';
  numeroAsistentes: number = 1;
  comentarios: string = '';
  serviciosSeleccionados: Servicio[] = [];

  constructor(
    private reservaService: ReservaService,
    private procesaReservaService: ProcesaReservaService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router // Inyecta el router para redirección
  ) {
    this.usuarioActual$ = this.authService.usuarioActual$;
  }

  ngOnInit(): void {
    const eventoId = this.route.snapshot.paramMap.get('id')!;
    
    // Inicializa los observables
    this.evento$ = this.reservaService.getEventoById(eventoId);
    this.servicios$ = this.reservaService.getServicios();

    // Calcula el total y actualiza el valor formateado
    this.total$ = this.procesaReservaService.calcularTotal(this.evento$, this.serviciosSeleccionados);

    // Suscríbete al observable total$ para obtener el valor formateado
    this.total$.subscribe(total => {
      this.totalFormatted = total.toFixed(2); // Formatea el total aquí
    });
  }

  onServicioChange(event: any, servicio: Servicio): void {
    if (event.target.checked) {
      this.serviciosSeleccionados.push(servicio);
    } else {
      this.serviciosSeleccionados = this.serviciosSeleccionados.filter(s => s.id !== servicio.id);
    }

    // Recalcula el total
    this.total$ = this.procesaReservaService.calcularTotal(this.evento$, this.serviciosSeleccionados);

    // Actualiza el valor formateado
    this.total$.subscribe(total => {
      this.totalFormatted = total.toFixed(2);
    });
  }

  createReserva(eventoId: string): void {
    // Validar campos obligatorios
    if (!this.fecha || !this.hora || !this.numeroAsistentes || this.numeroAsistentes < 1) {
      Swal.fire({
        title: 'Campos Obligatorios',
        text: 'Todos los campos obligatorios deben ser completados.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }

    this.usuarioActual$.subscribe(usuario => {
      if (usuario) {
        const reservaData: Reserva = {
          clienteID: usuario.id,
          eventoID: eventoId,
          fecha: this.fecha,
          hora: this.hora,
          numeroAsistentes: this.numeroAsistentes,
          comentarioEmpleado: this.comentarios,
          fechaReserva: new Date().toISOString(),
          servicios: this.serviciosSeleccionados // Asegúrate de incluir esta propiedad
        };

        this.reservaService.createReserva(reservaData).then(() => {
          Swal.fire({
            title: 'Reserva Confirmada',
            text: 'Su reserva ha sido enviada correctamente. Se le notificará en las próximas horas sobre el estado de su reserva.',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {
            this.router.navigate(['/events']); // Redirige a la página de eventos
          });
        }).catch(error => {
          Swal.fire({
            title: 'Error',
            text: 'Hubo un error al crear la reserva. Por favor, intente nuevamente.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
          console.error('Error al crear la reserva:', error);
        });
      } else {
        Swal.fire({
          title: 'Iniciar Sesión',
          text: 'Debe iniciar sesión para realizar una reserva.',
          icon: 'warning',
          confirmButtonText: 'Iniciar Sesión'
        }).then(() => {
          this.router.navigate(['/login']); // Redirige a la página de inicio de sesión
        });
      }
    });
  }
}
