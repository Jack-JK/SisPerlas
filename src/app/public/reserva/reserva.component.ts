import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
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
  reservaConfirmada: boolean = false; // Nuevo estado para verificar reserva confirmada

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
    private router: Router
  ) {
    this.usuarioActual$ = this.authService.usuarioActual$;
  }

  ngOnInit(): void {
    const eventoId = this.route.snapshot.paramMap.get('id')!;
    this.evento$ = this.reservaService.getEventoById(eventoId);
    this.servicios$ = this.reservaService.getServicios();
    this.total$ = this.procesaReservaService.calcularTotal(this.evento$, this.serviciosSeleccionados);

    this.total$.subscribe(total => {
      this.totalFormatted = total.toFixed(2);
    });
  }

  onServicioChange(event: any, servicio: Servicio): void {
    if (event.target.checked) {
      this.serviciosSeleccionados.push(servicio);
    } else {
      this.serviciosSeleccionados = this.serviciosSeleccionados.filter(s => s.id !== servicio.id);
    }

    this.total$ = this.procesaReservaService.calcularTotal(this.evento$, this.serviciosSeleccionados);
    this.total$.subscribe(total => {
      this.totalFormatted = total.toFixed(2);
    });
  }

  isFechaValida(): boolean {
    const fechaActual = new Date();
    const fechaSeleccionada = new Date(this.fecha);
    return fechaSeleccionada >= fechaActual;
  }

  verificarDisponibilidad(): void {
    if (!this.fecha || !this.hora || !this.numeroAsistentes || this.numeroAsistentes < 1) {
      Swal.fire({
        title: 'Campos Obligatorios',
        text: 'Todos los campos obligatorios deben ser completados.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }

    if (!this.isFechaValida()) {
      Swal.fire({
        title: 'Fecha No Válida',
        text: 'La fecha seleccionada no puede ser anterior a la fecha actual.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    this.reservaService.verificarDisponibilidad(this.fecha).subscribe(disponible => {
      if (disponible) {
        Swal.fire({
          title: 'Confirmar Reserva',
          text: 'La fecha está disponible. ¿Desea confirmar la reserva?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Confirmar',
          cancelButtonText: 'Cancelar'
        }).then(result => {
          if (result.isConfirmed) {
            this.reservaConfirmada = true;
            this.createReserva(this.route.snapshot.paramMap.get('id')!);
          }
        });
      } 
    });
  }

  createReserva(eventoId: string): void {
    this.usuarioActual$.subscribe(usuario => {
      if (usuario) {
        const reservaData: Reserva = {
          clienteID: usuario.id,
          eventoID: eventoId,
          fecha: this.fecha,
          hora: this.hora,
          numeroAsistentes: this.numeroAsistentes,
          estado: 'Pendiente',
          comentarioEmpleado: this.comentarios,
          fechaReserva: new Date().toISOString(),
          servicios: this.serviciosSeleccionados
        };

        this.reservaService.createReserva(reservaData).then(() => {
          Swal.fire({
            title: 'Reserva Confirmada',
            text: 'Su reserva ha sido enviada correctamente. Se le notificará en las próximas horas sobre el estado de su reserva.',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {
            this.router.navigate(['/events']);
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
          this.router.navigate(['/login']);
        });
      }
    });
  }
}
