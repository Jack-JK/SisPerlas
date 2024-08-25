import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Evento } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  
  private eventsCollection: AngularFirestoreCollection<Evento>;

  constructor(private firestore: AngularFirestore) {
    // Inicialización de la colección después de que firestore esté disponible
    this.eventsCollection = this.firestore.collection<Evento>('events');
  }

  // Método para crear un nuevo evento
  createEvent(event: Evento): Promise<void> {
    const id = this.firestore.createId();
    return this.eventsCollection.doc(id).set({ ...event, id });
  }

  // Método para obtener todos los eventos
  getEvents(): Observable<Evento[]> {
    return this.eventsCollection.valueChanges({ idField: 'id' });
  }

  // Método para obtener un evento por su ID
  getEventById(id: string): Observable<Evento | undefined> {
    return this.eventsCollection.doc<Evento>(id).valueChanges();
  }

  // Método para actualizar un evento existente
  updateEvent(id: string, event: Partial<Evento>): Promise<void> {
    return this.eventsCollection.doc(id).update(event);
  }

  // Método para eliminar un evento
  deleteEvent(id: string): Promise<void> {
    return this.eventsCollection.doc(id).delete();
  }
}
