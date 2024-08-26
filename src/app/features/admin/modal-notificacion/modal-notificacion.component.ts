import { Component, OnInit, Input } from '@angular/core';
import { Reserva } from '../../../core/models/reservation.model';
import { ReservaService } from '../../../core/services/reserva.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal-notificacion',
  templateUrl: './modal-notificacion.component.html',
  styleUrls: ['./modal-notificacion.component.css']
})
export class ModalNotificacionComponent implements OnInit {
  @Input() isModalOpen: boolean = false; // Controlar la apertura del modal
  pendingReservations: Reserva[] = [];

  constructor(private reservaService: ReservaService, private router: Router) {}

  ngOnInit(): void {
    this.loadPendingReservations();
  }

  loadPendingReservations() {
    this.reservaService.getReservasConUsuarios().subscribe(reservas => {
      this.pendingReservations = reservas.filter(reserva => reserva.estado === 'Pendiente');
    });
  }

  viewReserva(reserva: Reserva) {
    this.router.navigate(['/admin/reservas']);
  }

  closeModal() {
    this.isModalOpen = false; // Cierra el modal
  }
}
