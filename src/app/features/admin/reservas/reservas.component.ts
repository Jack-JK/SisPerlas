import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Reserva } from '../../../core/models/reservation.model';
import { EmailService } from '../../../core/services/email.service';
import { ReservaService } from '../../../core/services/reserva.service';

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css']
})
export class ReservasComponent implements OnInit {
  reservasPendientes: (Reserva & { usuario?: any })[] = [];
  reservasFiltradas: (Reserva & { usuario?: any })[] = [];
  estados = ['Todas', 'Pendiente', 'Confirmada'];
  estadoSeleccionado = 'Todas';
  modalAbierto: boolean = false;
  reservaSeleccionada: Reserva | undefined;
  imagenAdjunta: File | null = null;
  imagenPrevia: string | ArrayBuffer | null = null;

  currentPage: number = 1;
  itemsPerPage: number = 5;

  constructor(
    private reservaService: ReservaService,
    private emailService: EmailService
  ) {}

  ngOnInit(): void {
    this.reservaService.getReservasConUsuarios().subscribe(reservas => {
      this.reservasPendientes = reservas;
      this.filtrarReservas();
    });
  }

  abrirModal(reserva: Reserva): void {
    this.reservaSeleccionada = reserva;
    this.modalAbierto = true;
  }

  cerrarModal(): void {
    this.modalAbierto = false;
    this.reservaSeleccionada = undefined;
    this.imagenAdjunta = null;
    this.imagenPrevia = null; // Limpia la previsualización al cerrar el modal
  }

  confirmarReserva(): void {
    if (this.reservaSeleccionada && this.imagenAdjunta) {
      this.emailService.sendReservationConfirmation(this.reservaSeleccionada, this.imagenAdjunta)
        .then(() => {
          return this.reservaService.updateReserva(this.reservaSeleccionada!.id!, { estado: 'Confirmada' });
        })
        .then(() => {
          Swal.fire('¡Reserva Confirmada!', 'El correo ha sido enviado con éxito.', 'success');
          this.cerrarModal();
        })
        .catch(() => {
          Swal.fire('Error', 'Hubo un problema al confirmar la reserva.', 'error');
        });
    } else {
      Swal.fire('Error', 'Por favor, adjunta una imagen antes de confirmar.', 'error');
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imagenPrevia = reader.result;
      };
      reader.readAsDataURL(file);
      this.imagenAdjunta = file; // Guarda el archivo seleccionado
    }
  }

  // Filtrar las reservas por estado
  filtrarReservas(): void {
    if (this.estadoSeleccionado === 'Todas') {
      this.reservasFiltradas = this.reservasPendientes;
    } else {
      this.reservasFiltradas = this.reservasPendientes.filter(reserva => reserva.estado === this.estadoSeleccionado);
    }
    this.currentPage = 1; // Reiniciar a la primera página al cambiar el filtro
  }

  // Obtener las reservas para la página actual
  get reservasPaginadas(): (Reserva & { usuario?: any })[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.reservasFiltradas.slice(startIndex, startIndex + this.itemsPerPage);
  }

  // Cambiar de página
  cambiarPagina(pagina: number): void {
    this.currentPage = pagina;
  }

  // Obtener el número total de páginas
  get totalPages(): number {
    return Math.ceil(this.reservasFiltradas.length / this.itemsPerPage);
  }
}
