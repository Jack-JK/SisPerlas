import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable, combineLatest, forkJoin, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Reserva } from '../models/reservation.model';
import { Usuario } from '../models/user.model';
import { Servicio } from '../models/servicio.model';
import { Evento } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  
  private reservasCollection: AngularFirestoreCollection<Reserva>;
  private serviciosCollection: AngularFirestoreCollection<Servicio>;
  private usuariosCollection: AngularFirestoreCollection<Usuario>;
  private eventosCollection: AngularFirestoreCollection<Evento>;


  constructor(private firestore: AngularFirestore) {
    this.reservasCollection = this.firestore.collection<Reserva>('reservas');
    this.serviciosCollection = this.firestore.collection<Servicio>('servicios');
    this.usuariosCollection = this.firestore.collection<Usuario>('Usuarios');
    this.eventosCollection = this.firestore.collection<Evento>('events');



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
    return this.reservasCollection.doc<Reserva>(id).valueChanges().pipe(
      switchMap(reserva => {
        if (!reserva) {
          return of(undefined);
        }
        return this.getUserById(reserva.clienteID).pipe(
          map(usuario => ({
            ...reserva,
            usuario
          }))
        );
      })
    );
  }
  

  // Método para obtener todas las reservas con la información del usuario
  getReservasConUsuarios(): Observable<(Reserva & { usuario?: Usuario })[]> {
    return this.reservasCollection.valueChanges({ idField: 'id' }).pipe(
      switchMap(reservas => {
        if (reservas.length === 0) {
          return of([]);
        }
        const userObservables$ = reservas.map(reserva => {
          return this.getUserById(reserva.clienteID).pipe(
            map(usuario => ({
              ...reserva,
              usuario
            }))
          );
        });
        return combineLatest(userObservables$);
      })
    );
  }
  
  // Método para actualizar una reserva existente
  updateReserva(id: string, reserva: Partial<Reserva>): Promise<void> {
    return this.reservasCollection.doc(id).update(reserva);
  }
// Método para obtener todas las reservas con la información del evento
getReservasConEventos(): Observable<(Reserva & { evento?: Evento })[]> {
  return this.reservasCollection.valueChanges({ idField: 'id' }).pipe(
    switchMap(reservas => {
      if (reservas.length === 0) {
        return of([]);
      }
      const eventoObservables$ = reservas.map(reserva => {
        return this.eventosCollection.doc<Evento>(reserva.eventoID).valueChanges().pipe(
          map(evento => ({
            ...reserva,
            evento
          }))
        );
      });
      return combineLatest(eventoObservables$);
    })
  );
}
  // Método para obtener reservas agrupadas por estado
  getReservasPorEstado(): Observable<{ estado: string; cantidad: number }[]> {
    return this.reservasCollection.valueChanges({ idField: 'id' }).pipe(
      map(reservas => {
        // Agrupar las reservas por estado
        const reservasPorEstado = reservas.reduce((acc, reserva) => {
          const estado = reserva.estado; // Asumiendo que 'estado' es el campo que contiene el estado de la reserva
          if (!acc[estado]) {
            acc[estado] = 0;
          }
          acc[estado]++;
          return acc;
        }, {} as Record<string, number>);

        // Convertir el objeto de estados en un array de objetos con estado y cantidad
        return Object.keys(reservasPorEstado).map(estado => ({
          estado,
          cantidad: reservasPorEstado[estado]
        }));
      })
    );
  }

  // Método para obtener todas las reservas con la información de los servicios
  getReservasConServicios(): Observable<(Reserva & { servicios?: Servicio[] })[]> {
    return this.reservasCollection.valueChanges({ idField: 'id' }).pipe(
      switchMap(reservas => {
        if (reservas.length === 0) {
          return of([]);
        }

        // Crear un observable para cada reserva que obtiene sus servicios asociados
        const reservasConServiciosObservables$ = reservas.map(reserva => {
          if (reserva.servicios.length === 0) {
            return of({ ...reserva, servicios: [] });
          }
          
          // Crear un observable para cada servicio en la reserva
          const servicioObservables$ = reserva.servicios.map(servicio =>
            this.serviciosCollection.doc<Servicio>(servicio.id).valueChanges().pipe(
              map(servicioData => servicioData || servicio) // Si el servicio no se encuentra, usa el objeto servicio original
            )
          );

          return combineLatest(servicioObservables$).pipe(
            map(servicios => ({
              ...reserva,
              servicios
            }))
          );
        });

        // Combinar todos los observables de reservas en un solo observable
        return combineLatest(reservasConServiciosObservables$);
      })
    );

  }
  getUserById(id: string): Observable<Usuario | undefined> {
    return this.firestore.collection<Usuario>('Usuarios').doc(id).valueChanges().pipe(
      catchError(err => {
        console.error('Error al obtener usuario por ID:', err);
        return of(undefined);
      })
    );
  }
  verificarDisponibilidad(fecha: string): Observable<boolean> {
    return this.reservasCollection.valueChanges({ idField: 'id' }).pipe(
      map(reservas => {
        // Verifica si hay reservas en la misma fecha con el estado 'Confirmada'
        const hayReservaConfirmada = reservas.some(reserva => 
          reserva.fecha === fecha         );
        // Retorna true si hay una reserva confirmada, false si no hay ninguna
        return hayReservaConfirmada;
      }),
      catchError(err => {
        console.error('Error al verificar disponibilidad:', err);
        return of(false); // Asume que la fecha está disponible en caso de error
      })
    );
  }
  // Método para eliminar una reserva
  deleteReserva(id: string): Promise<void> {
    return this.reservasCollection.doc(id).delete();
  }
}
