export interface Evento {
  id?: string; // Firebase document ID
  nombre: string;
  descripcion?: string; // Optional field
  precio: number;
  imagenUrl?: string; // Optional field for the image URL
  categoria?: string; // Optional field for the category
  capacidadMaxima?: number; // Optional field for the maximum capacity
}
