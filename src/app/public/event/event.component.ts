import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Evento } from '../../core/models/event.model';
import { EventService } from '../../core/services/event.service';
import { AuthService } from '../../core/services/auth.service';
import Swal from 'sweetalert2'; // Importa SweetAlert2

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {
  events$: Observable<Evento[]>; // Observable para todos los eventos
  filteredEvents: Evento[] = []; // Eventos filtrados
  searchTerm: string = ''; // Término de búsqueda
  selectedCategory: string = ''; // Categoría seleccionada
  maxPrice: number | null = null; // Precio máximo seleccionado

  categories: string[] = []; // Lista de categorías

  constructor(private eventService: EventService, private authService: AuthService) {
    this.events$ = this.eventService.getEvents();
  }

  ngOnInit(): void {
    this.events$.subscribe(events => {
      this.filteredEvents = events;
      this.categories = Array.from(new Set(events.map(event => event.categoria).filter(c => c !== undefined))) as string[];
      this.filterEvents();
    });
  }

  filterEvents(): void {
    this.events$.pipe(
      map(events => {
        return events.filter(event => {
          const matchesSearchTerm = event.nombre.toLowerCase().includes(this.searchTerm.toLowerCase());
          const matchesCategory = this.selectedCategory ? event.categoria === this.selectedCategory : true;
          const matchesPrice = this.maxPrice !== null ? event.precio <= this.maxPrice : true;
          return matchesSearchTerm && matchesCategory && matchesPrice;
        });
      })
    ).subscribe(filtered => this.filteredEvents = filtered);
  }

  checkAndReserve(eventoId: string): void {
    this.authService.isLoggedIn().subscribe(isLoggedIn => {
      if (isLoggedIn) {
        // Usuario autenticado, permitir la reserva
        window.location.href = `/reservation/${eventoId}`;
      } else {
        // Usuario no autenticado, mostrar alerta y redirigir a la página de login
        Swal.fire({
          icon: 'warning',
          title: 'Debe iniciar sesión',
          text: 'Por favor, inicie sesión antes de realizar una reserva.',
          confirmButtonText: 'Iniciar sesión',
          showCancelButton: true,
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = '/auth/login';
          }
        });
      }
    });
  }
}
