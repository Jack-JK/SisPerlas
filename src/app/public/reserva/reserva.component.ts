import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, from, of } from 'rxjs';
import { catchError, finalize, map, switchMap, takeUntil } from 'rxjs/operators';
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
export class ReservaComponent implements OnInit, OnDestroy {
  evento$!: Observable<Evento | undefined>;
  servicios$!: Observable<Servicio[]>;
  usuarioActual$: Observable<Usuario | null>;
  total$!: Observable<number>;
  totalFormatted: string = '';

  fecha: string = '';
  hora: string = '';
  numeroAsistentes: number = 1;
  comentarios: string = '';
  serviciosSeleccionados: Servicio[] = [];
  private destroy$ = new Subject<void>();
  public reservaEnProceso: boolean = false;

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
    this.total$.subscribe(total => this.totalFormatted = total.toFixed(2));
  }

  onServicioChange(event: any, servicio: Servicio): void {
    if (event.target.checked) {
      this.serviciosSeleccionados.push(servicio);
    } else {
      this.serviciosSeleccionados = this.serviciosSeleccionados.filter(s => s.id !== servicio.id);
    }
    this.updateTotal();
  }

  private verificarDisponibilidad(fecha: string): Observable<boolean> {
    return this.reservaService.verificarDisponibilidad(fecha).pipe(
      map(ocupada => !ocupada),
      catchError(err => {
        console.error('Error al verificar disponibilidad:', err);
        return of(false);
      })
    );
  }

  createReserva(eventoId: string): void {
   

    if (!this.fecha || this.numeroAsistentes < 1) {
      this.showAlert('Campos Obligatorios', 'Todos los campos obligatorios deben ser completados.', 'warning')
        .pipe(
          finalize(() => this.reservaEnProceso = false)
        )
        .subscribe();
      return;
    }

    Swal.fire({
      title: 'Procesando reserva',
      text: 'Por favor, espere mientras procesamos su reserva.',
      icon: 'info',
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.verificarDisponibilidad(this.fecha).pipe(
      switchMap(disponible => {
        if (!disponible) {
          return this.showAlert('Fecha Ocupada', 'La fecha seleccionada ya está ocupada. Por favor, elija otra fecha.', 'warning')
            .pipe(
              finalize(() => {
                this.reservaEnProceso = false;
                Swal.close();
              })
            );
        }

        return this.usuarioActual$.pipe(
          switchMap(usuario => {
            if (!usuario) {
              return this.showAlert('Iniciar Sesión', 'Debe iniciar sesión para realizar una reserva.', 'warning')
                .pipe(
                  finalize(() => {
                    this.reservaEnProceso = false;
                    Swal.close();
                    this.router.navigate(['/auth/login']);
                  })
                );
            }

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

            return from(this.reservaService.createReserva(reservaData)).pipe(
              switchMap(() =>
                this.showAlert('Reserva Confirmada', 'Su reserva ha sido enviada correctamente. Se le notificará en las próximas horas sobre el estado de su reserva.', 'success')
                  .pipe(
                    finalize(() => {
                      this.reservaEnProceso = false;
                      this.router.navigate(['/events']);
                    })
                  )
              ),
              catchError(error => {
                this.handleReservaError(error, 'Hubo un error al crear la reserva. Por favor, intente nuevamente.');
                return of(false);
              })
            );
          })
        );
      }),
      catchError(error => {
        this.handleReservaError(error, 'Hubo un error inesperado. Por favor, intente nuevamente.');
        return of(false);
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  private updateTotal(): void {
    this.total$ = this.procesaReservaService.calcularTotal(this.evento$, this.serviciosSeleccionados);
    this.total$.subscribe(total => this.totalFormatted = total.toFixed(2));
  }

  private showAlert(title: string, text: string, icon: 'success' | 'error' | 'warning'): Observable<void> {
    return new Observable<void>(observer => {
      Swal.fire({
        title,
        text,
        icon,
        confirmButtonText: 'OK'
      }).then(() => {
        observer.next();
        observer.complete();
      });
    });
  }

  private handleReservaError(error: any, mensaje: string): void {
    console.error(error);
    this.showAlert('Error', mensaje, 'error')
      .pipe(
        finalize(() => {
          this.reservaEnProceso = false;
          Swal.close();
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
