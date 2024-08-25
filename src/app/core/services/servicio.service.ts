import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Servicio } from '../models/servicio.model';

@Injectable({
  providedIn: 'root'
})
export class ServicioService {
  
  private serviciosCollection: AngularFirestoreCollection<Servicio>;

  constructor(private firestore: AngularFirestore) {
    // Inicialización de la colección después de que firestore esté disponible
    this.serviciosCollection = this.firestore.collection<Servicio>('servicios');
  }

  // Método para crear un nuevo servicio
  createServicio(servicio: Servicio): Promise<void> {
    const id = this.firestore.createId();
    return this.serviciosCollection.doc(id).set({ ...servicio, id });
  }

  // Método para obtener todos los servicios
  getServicios(): Observable<Servicio[]> {
    return this.serviciosCollection.valueChanges({ idField: 'id' });
  }

  // Método para obtener un servicio por su ID
  getServicioById(id: string): Observable<Servicio | undefined> {
    return this.serviciosCollection.doc<Servicio>(id).valueChanges();
  }

  // Método para actualizar un servicio existente
  updateServicio(id: string, servicio: Partial<Servicio>): Promise<void> {
    return this.serviciosCollection.doc(id).update(servicio);
  }

  // Método para eliminar un servicio
  deleteServicio(id: string): Promise<void> {
    return this.serviciosCollection.doc(id).delete();
  }
}
