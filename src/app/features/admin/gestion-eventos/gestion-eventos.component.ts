import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Evento } from '../../../core/models/event.model';
import { EventService } from '../../../core/services/event.service';

@Component({
  selector: 'app-gestion-eventos',
  templateUrl: './gestion-eventos.component.html',
  styleUrls: ['./gestion-eventos.component.css']
})
export class GestionEventosComponent implements OnInit {
  eventos: Evento[] = [];
  eventoSeleccionado?: Evento;
  modalAbierto = false;
  currentPage = 1;
  pageSize = 5;
  totalPages = 0;
  eventoForm: FormGroup;

  constructor(private eventService: EventService, private fb: FormBuilder) {
    this.eventoForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: ['', [Validators.required, Validators.min(0)]],
      imagenUrl: ['', Validators.required],
      categoria: ['', Validators.required],
      capacidadMaxima: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    this.eventService.getEvents().subscribe(events => {
      this.eventos = events;
      this.totalPages = Math.ceil(this.eventos.length / this.pageSize);
      this.updatePage();
    });
  }

  updatePage() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.eventos = this.eventos.slice(startIndex, endIndex);
  }

  abrirModal(evento?: Evento) {
    this.eventoSeleccionado = evento;
    this.modalAbierto = true;
    this.eventoForm.reset(evento || {});
  }

  cerrarModal() {
    this.modalAbierto = false;
    this.eventoSeleccionado = undefined;
  }

  async agregarEvento() {
    if (this.eventoForm.invalid) {
      return;
    }

    try {
      const evento: Evento = this.eventoForm.value;
      if (this.eventoSeleccionado?.id) {
        await this.eventService.updateEvent(this.eventoSeleccionado.id, evento);
        await Swal.fire('Actualizado!', 'El evento ha sido actualizado.', 'success');
      } else {
        await this.eventService.createEvent(evento);
        await Swal.fire('Creado!', 'El evento ha sido creado.', 'success');
      }
      this.loadEvents();
    } catch (error) {
      await Swal.fire('Error', 'Ocurrió un error al procesar la solicitud.', 'error');
    } finally {
      this.cerrarModal();
    }
  }

  async eliminarEvento(id: string) {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await this.eventService.deleteEvent(id);
        await Swal.fire('Eliminado!', 'El evento ha sido eliminado.', 'success');
        this.loadEvents();
      } catch (error) {
        await Swal.fire('Error', 'Ocurrió un error al eliminar el evento.', 'error');
      }
    }
  }

  cambiarPagina(pagina: number) {
    this.currentPage = pagina;
    this.updatePage();
  }
}
