import { Usuario } from './user.model'; // Asegúrate de importar la interfaz Usuario
import { Servicio } from './servicio.model';

export interface Reserva {
  id?: string; 
  clienteID: string; 
  eventoID: string; 
  fecha: string; 
  hora: string; 
  numeroAsistentes: number;
  estado: string;
  comentarioEmpleado?: string;
  fechaReserva: string; 
  servicios: Servicio[];
  usuario?: Usuario; // Agrega esta propiedad opcional para incluir información del usuario
  total?:number;
}
