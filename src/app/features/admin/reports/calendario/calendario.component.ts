import { Component, OnInit } from '@angular/core';
import { ReservaService } from '../../../../core/services/reserva.service';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { formatDate } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css']
})
export class CalendarioComponent implements OnInit {

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin],
    events: [],
    eventClick: this.handleEventClick.bind(this),
    eventColor: '#378006'
  };

  constructor(private reservaService: ReservaService) { }

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    this.reservaService.getReservasConUsuarios().subscribe(reservas => {
      this.calendarOptions.events = reservas.map(reserva => {
        let colorEvento = '#378006'; // Color por defecto (verde)
  
        // Cambia el color basado en el estado de la reserva
        if (reserva.estado === 'Pendiente') {
          colorEvento = '#FF0000'; // Rojo para reservas pendientes
        } else if (reserva.estado === 'Confirmada') {
          colorEvento = '#008000'; // Verde para reservas confirmadas
        }
  
        return {
          title: `Reserva ${reserva.usuario?.nombre || 'Desconocido'}`,
          start: reserva.fecha,
          color: colorEvento,
          extendedProps: {
            reservaId: reserva.id,
            cliente: reserva.usuario?.nombre,
            hora: reserva.hora,
            estado: reserva.estado
          }
        };
      });
    });
  }

  handleEventClick(arg: EventClickArg): void {
    // Detener la propagación del evento
    arg.jsEvent.stopPropagation();
  
    const reservaId = arg.event.extendedProps['reservaId'];
  
    if (!reservaId) {
      Swal.fire('Error', 'No se encontró el ID de la reserva.', 'error');
      return;
    }
  
    // Evitar el doble clic deshabilitando el botón de confirmación temporalmente
    Swal.fire({
      title: 'Cargando detalles...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  
    this.reservaService.getReservaById(reservaId).subscribe(reserva => {
      Swal.close(); // Cerrar el loader antes de abrir el modal
  
      if (reserva) {
        const nombreUsuario = reserva.usuario?.nombre || 'Desconocido';
  
        Swal.fire({
          title: 'Detalles de la Reserva',
          html: `
            <p><strong>Cliente:</strong> ${nombreUsuario}</p>
            <p><strong>Fecha:</strong> ${formatDate(reserva.fecha, 'dd/MM/yyyy', 'en-US')}</p>
            <p><strong>Hora:</strong> ${reserva.hora}</p>
            <p><strong>Estado:</strong> ${reserva.estado}</p>
          `,
          icon: 'info',
          confirmButtonText: 'Cerrar'
        });
      } else {
        Swal.fire('Error', 'No se encontró la reserva.', 'error');
      }
    }, error => {
      Swal.close(); // Asegúrate de cerrar cualquier loading en caso de error
      console.error('Error al obtener la reserva:', error);
      Swal.fire('Error', 'Ocurrió un error al intentar obtener la información de la reserva.', 'error');
    });
  }
  
}
