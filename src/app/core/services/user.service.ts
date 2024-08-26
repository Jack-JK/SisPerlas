import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Usuario } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private usersCollection: AngularFirestoreCollection<Usuario>;

  constructor(private firestore: AngularFirestore) {
    this.usersCollection = this.firestore.collection<Usuario>('Usuarios');
  }

  // Método para crear un nuevo usuario
  createUser(user: Usuario): Promise<void> {
    const id = this.firestore.createId();
    return this.usersCollection.doc(id).set({ ...user, id });
  }

  // Método para obtener todos los usuarios
  getUsers(): Observable<Usuario[]> {
    return this.usersCollection.valueChanges({ idField: 'id' });
  }

  // Método para obtener un usuario por su ID
  getUserById(id: string): Observable<Usuario | undefined> {
    return this.usersCollection.doc<Usuario>(id).valueChanges();
  }

  // Método para actualizar un usuario existente
  updateUser(id: string, user: Partial<Usuario>): Promise<void> {
    return this.usersCollection.doc(id).update(user);
  }

  // Método para eliminar un usuario
  deleteUser(id: string): Promise<void> {
    return this.usersCollection.doc(id).delete();
  }
}
