import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Reserva } from '../models/reservation.model';
import { Servicio } from '../models/servicio.model';
import { Evento } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  
  private reservasCollection: AngularFirestoreCollection<Reserva>;
  private serviciosCollection: AngularFirestoreCollection<Servicio>;

  constructor(private firestore: AngularFirestore) {
    // Inicialización de la colección después de que firestore esté disponible
    this.reservasCollection = this.firestore.collection<Reserva>('reservas');
    this.serviciosCollection = this.firestore.collection<Servicio>('servicios');

  }

  // Método para crear una nueva reserva
  createReserva(reserva: Reserva): Promise<void> {
    const id = this.firestore.createId();
    return this.reservasCollection.doc(id).set({ ...reserva, id });
  }

 // Método para obtener todos los servicios
 getServicios(): Observable<Servicio[]> {
  return this.serviciosCollection.valueChanges({ idField: 'id' });
}

 // Obtener detalles del evento por ID
 getEventoById(eventId: string): Observable<Evento | undefined> {
  return this.firestore.collection<Evento>('events').doc(eventId).valueChanges();
}

  // Método para obtener todas las reservas
  getReservas(): Observable<Reserva[]> {
    return this.reservasCollection.valueChanges({ idField: 'id' });
  }

  // Método para obtener una reserva por su ID
  getReservaById(id: string): Observable<Reserva | undefined> {
    return this.reservasCollection.doc<Reserva>(id).valueChanges();
  }

  // Método para actualizar una reserva existente
  updateReserva(id: string, reserva: Partial<Reserva>): Promise<void> {
    return this.reservasCollection.doc(id).update(reserva);
  }

  // Método para eliminar una reserva
  deleteReserva(id: string): Promise<void> {
    return this.reservasCollection.doc(id).delete();
  }
}
