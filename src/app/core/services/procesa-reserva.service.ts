import { Injectable } from '@angular/core';
import { ReservaService } from './reserva.service';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Evento } from '../models/event.model';
import { Servicio } from '../models/servicio.model';
import { Reserva } from '../models/reservation.model';

@Injectable({
  providedIn: 'root'
})
export class ProcesaReservaService {

  constructor(private reservaService: ReservaService) {}

  // Método para calcular el total de la reserva
  calcularTotal(evento$: Observable<Evento | undefined>, serviciosSeleccionados: Servicio[]): Observable<number> {
    return combineLatest([evento$, this.reservaService.getServicios()]).pipe(
      map(([evento]) => {
        if (!evento) return 0;

        const totalServicios = serviciosSeleccionados.reduce((sum, servicio) => sum + servicio.precio, 0);
        return evento.precio + totalServicios;
      })
    );
  }

  // Método para procesar la reserva
  procesarReserva(reservaData: Reserva): Promise<void> {
    return this.reservaService.createReserva(reservaData);
  }

  // Método para verificar la disponibilidad de la fecha
  verificarDisponibilidad(fecha: string): Observable<boolean> {
    return this.reservaService.verificarDisponibilidad(fecha).pipe(
      map(ocupada => !ocupada) // Devuelve true si la fecha está disponible
    );
  }
}
