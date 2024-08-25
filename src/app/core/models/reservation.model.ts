import { Servicio } from './servicio.model';

export interface Reserva {
  id?: string; 
  clienteID: string; 
  eventoID: string; 
  fecha: string; 
  hora: string; 
  numeroAsistentes: number;
  estado?: string;
  comentarioEmpleado?: string;
  fechaReserva: string; 
  servicios: Servicio[]; 
}
