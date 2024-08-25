import { Component, OnInit } from '@angular/core';
import { Evento } from '../../core/models/event.model';
import { EventService } from '../../core/services/event.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  events: Evento[] = [];
  testimonials = [
    {
      message: "La boda de nuestros sueños se hizo realidad gracias a Las Perlas. El servicio fue excepcional.",
      name: "Ana & Carlos",
      role: "Clientes de Boda",
      image: "https://st4.depositphotos.com/15964096/21123/i/450/depositphotos_211231514-stock-photo-happy-couple-young-newlyweds-posing.jpg"
    },
    {
      message: "La fiesta de 15 años de mi hija fue inolvidable. Las Perlas superó nuestras expectativas.",
      name: "Marta Gómez",
      role: "Madre de la Quinceañera",
      image: "https://fox59.com/wp-content/uploads/sites/21/2023/09/Quinceanera-a-beautiful-Latina-tradition.jpg"
    },
    {
      message: "La graduación de mi hijo fue un éxito gracias a de Las Perlas. ¡No podríamos estar más contentos!",
      name: "Luis Hernández",
      role: "Padre del Graduado",
      image: "https://ia-colombia.co/wp-content/uploads/2022/09/Shutterstock_2161048459.jpg"
    }
    // Añade más testimonios si es necesario
  ];

  currentIndex: number = 0;
  constructor(private eventService: EventService) { }
  ngOnInit(): void {
    this.startCarousel();
    this.loadEvents();

  }

  startCarousel() {
    setInterval(() => {
      this.nextSlide();
    }, 5000); // Cambia el slide cada 5 segundos
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.testimonials.length;
  }
  loadEvents(): void {
    this.eventService.getEvents().subscribe(events => {
      this.events = events.slice(0, 6); // Get the first 6 events
    });
  }
  reserveEvent(id: string): void {
    window.location.href = `/reservation/${id}`;
  }
  prevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.testimonials.length) % this.testimonials.length;
  }
}
