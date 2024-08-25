export interface Notificacion {
    id?: string; // Firebase document ID
    reservaID: string; // Reference to Reserva document
    clienteID: string; // Reference to Usuario document
    mensaje?: string; // Optional field
    fechaEnvio: string; // Stored as ISO string
    tipoNotificacion?: string; // Optional field
  }
  