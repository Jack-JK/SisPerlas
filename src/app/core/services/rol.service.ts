import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Rol } from '../models/rol.model';

@Injectable({
  providedIn: 'root'
})
export class RolService {

  private rolesCollection: AngularFirestoreCollection<Rol>;

  constructor(private firestore: AngularFirestore) {
    // Inicialización de la colección después de que firestore esté disponible
    this.rolesCollection = this.firestore.collection<Rol>('roles');
  }

  // Método para crear un nuevo rol
  createRol(rol: Rol): Promise<void> {
    const id = this.firestore.createId();
    return this.rolesCollection.doc(id).set({ ...rol, id });
  }

  // Método para obtener todos los roles
  getRoles(): Observable<Rol[]> {
    return this.rolesCollection.valueChanges({ idField: 'id' });
  }

  // Método para obtener un rol por su ID
  getRolById(id: string): Observable<Rol | undefined> {
    return this.rolesCollection.doc<Rol>(id).valueChanges();
  }

  // Método para actualizar un rol existente
  updateRol(id: string, rol: Partial<Rol>): Promise<void> {
    return this.rolesCollection.doc(id).update(rol);
  }

  // Método para eliminar un rol
  deleteRol(id: string): Promise<void> {
    return this.rolesCollection.doc(id).delete();
  }
}
