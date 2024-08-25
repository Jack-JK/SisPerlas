import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';
import { Usuario } from '../models/user.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  usuarioActual$!: Observable<Usuario | null>;
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private readonly idRol = 'tL4z8n0dRtKKEznw3pNG'; // ID de rol por defecto para cliente
  private readonly idUsuario = 'HNub7G1tchjypHXscJlq'; // ID de rol para administrador

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {
    this.usuarioActual$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.firestore.collection('Usuarios').doc<any>(user.uid).valueChanges();
        } else {
          return of(null);
        }
      }),
      catchError(error => {
        console.error('Error en AuthService:', error);
        return of(null);
      })
    );

    this.afAuth.authState.subscribe(user => {
      this.isLoggedInSubject.next(!!user);
    });
  }

  // Método para comprobar si el usuario está autenticado
  isLoggedIn(): Observable<boolean> {
    const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    return of(isLoggedIn);
  }

  // Método para obtener el nombre del usuario
  getUserName(): Observable<string> {
    return this.usuarioActual$.pipe(
      map(usuario => usuario ? usuario.nombre : '')
    );
  }

  // Método para registrar un usuario con correo electrónico y contraseña
  async registerWithEmail(
    email: string,
    password: string,
    nombre: string,
    apellido: string,
    telefono: string
  ): Promise<void> {
    try {
      const credential = await this.afAuth.createUserWithEmailAndPassword(email, password);
      const user = credential.user;

      if (user) {
        await this.createUserProfile(user.uid, email, nombre, apellido, telefono);
        await this.assignUserRole(user.uid); // Asignar rol de cliente por defecto
      } else {
        throw new Error('El usuario no se ha creado correctamente.');
      }
    } catch (error) {
      throw error;
    }
  }

  private async createUserProfile(
    uid: string,
    email: string,
    nombre: string,
    apellido: string,
    telefono: string
  ): Promise<void> {
    try {
      const newUser: Usuario = {
        id: uid,
        nombre,
        apellido,
        email,
        telefono,
      };
      await this.firestore.collection('Usuarios').doc(uid).set(newUser);
    } catch (error) {
      throw error;
    }
  }

 // Método para asignar el rol al usuario (por defecto se asigna el rol '1vTg2Cn43BKLueUHE0h4')
private async assignUserRole(uid: string): Promise<void> {
  try{

    await this.firestore.collection('UsuariosRoles').doc(uid).set({
      idUsuario:uid,
      idRol:'tL4z8n0dRtKKEznw3pNG'
    });
  }catch(error){
    throw error;
  }

}


  async loginWithEmail(email: string, password: string): Promise<void> {
    try {
      await this.afAuth.signInWithEmailAndPassword(email, password);
      localStorage.setItem('userLoggedIn', 'true');
    } catch (error) {
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await this.afAuth.signOut();
      localStorage.removeItem('userLoggedIn');
    } catch (error) {
      throw error;
    }
  }

  // Método para comprobar si el usuario es administrador
  isAdmin(): Observable<boolean> {
    return this.checkUserRole('HNub7G1tchjypHXscJlq');
  }

  // Método para comprobar si el usuario es cliente
  isClient(): Observable<boolean> {
    return this.checkUserRole('tL4z8n0dRtKKEznw3pNG');
  }

  // Método genérico para comprobar si un usuario tiene un rol específico
  private checkUserRole(roleId: string): Observable<boolean> {
    return this.afAuth.authState.pipe(
      switchMap(user => {
        if (!user) {
          return of(false); // Si no hay usuario, devuelve false
        } else {
          // Verifica el rol del usuario en la colección 'UsuariosRoles'
          return this.firestore.collection('UsuariosRoles', ref => ref.where('idUsuario', '==', user.uid).where('idRol', '==', roleId)).valueChanges().pipe(
            map(roles => {
              // Si existe al menos un documento que coincide, el usuario tiene el rol
              return roles.length > 0;
            })
          );
        }
      })
    );
  }
}
