
export interface Usuario {
    id: string; // ID opcional, se generará automáticamente en Firebase
    nombre: string;
    apellido: string;
    email: string;
    telefono?: string; // Opcional
    direccion?: string; // Opcional
  }
  