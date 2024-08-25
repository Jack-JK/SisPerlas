export interface Calendario {
    id?: string; // Firebase document ID
    fecha: string; // Stored as ISO string
    hora: string; // Time stored as HH:mm:ss
    eventoID: string; // Reference to Evento document
    estado?: string; // Optional field
  }
  