import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, from, of } from 'rxjs';
import { catchError, concatMap, switchMap, takeUntil } from 'rxjs/operators';
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
  private destroy$ = new Subject<void>();
  private isSubmitting = false; // Flag para controlar la creación de reservas

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

  private verificarDisponibilidad(): Observable<boolean> {
    return this.reservaService.verificarDisponibilidad(this.fecha).pipe(
      concatMap(ocupada => {
        if (ocupada) {
          return from(
            Swal.fire({
              title: 'Fecha Ocupada',
              text: 'La fecha seleccionada ya está ocupada. Por favor, elija otra fecha.',
              icon: 'warning',
              confirmButtonText: 'OK'
            }).then(() => {
              this.isSubmitting = false; // Restablece el flag después de mostrar el mensaje
              return false; // Devuelve false si la fecha está ocupada
            })
          );
        }
        return of(true); // Devuelve true si la fecha está disponible
      })
    );
  }
  

  private crearReserva(usuario: Usuario, eventoId: string): Observable<boolean> {
    const reservaData: Reserva = {
      clienteID: usuario.id,
      eventoID: eventoId,
      fecha: this.fecha,
      hora: this.hora,
      numeroAsistentes: this.numeroAsistentes,
      estado: 'Pendiente', // Establecer el estado como 'Pendiente' por defecto
      comentarioEmpleado: this.comentarios,
      fechaReserva: new Date().toISOString(),
      servicios: this.serviciosSeleccionados // Asegúrate de incluir esta propiedad
    };

    // Convierte la Promise en Observable
    return from(this.reservaService.createReserva(reservaData)).pipe(
      switchMap(() => of(true)), // Devuelve un observable verdadero si la reserva se creó con éxito
      catchError(error => {
        console.error('Error al crear la reserva:', error);
        Swal.fire({
          title: 'Error',
          text: 'Hubo un error al crear la reserva. Por favor, intente nuevamente.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        return of(false);
      })
    );
  }

  createReserva(eventoId: string): void {
    if (this.isSubmitting) return; // Evita múltiples envíos
    this.isSubmitting = true; // Establece el flag de envío
  
    // Validar campos obligatorios
    if (!this.fecha || !this.numeroAsistentes || this.numeroAsistentes < 1) {
      Swal.fire({
        title: 'Campos Obligatorios',
        text: 'Todos los campos obligatorios deben ser completados.',
        icon: 'warning',
        confirmButtonText: 'OK'
      }).then(() => {
        this.isSubmitting = false; // Restablece el flag
      });
      return;
    }
  
    // Verificar disponibilidad antes de crear la reserva
    this.verificarDisponibilidad().pipe(
      switchMap(disponible => {
        if (!disponible) {
          return of(false); // Si la fecha no está disponible, retorna falso
        }
        return this.usuarioActual$.pipe(
          switchMap(usuario => {
            if (usuario) {
              return this.crearReserva(usuario, eventoId);
            } else {
              Swal.fire({
                title: 'Iniciar Sesión',
                text: 'Debe iniciar sesión para realizar una reserva.',
                icon: 'warning',
                confirmButtonText: 'Iniciar Sesión'
              }).then(() => {
                this.router.navigate(['/auth/login']); // Redirige a la página de inicio de sesión
              });
              return of(false);
            }
          })
        );
      })
    ).pipe(takeUntil(this.destroy$)).subscribe(exito => {
      if (exito) {
        Swal.fire({
          title: 'Reserva Confirmada',
          text: 'Su reserva ha sido enviada correctamente. Se le notificará en las próximas horas sobre el estado de su reserva.',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/events']); // Redirige a la página de eventos
        });
      }
      this.isSubmitting = false; // Restablece el flag después de la operación
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
