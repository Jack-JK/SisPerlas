import { Injectable } from '@angular/core';
import emailjs from 'emailjs-com';
import { Reserva } from '../models/reservation.model';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private serviceId = 'service_ewep5xn';  // Tu Service ID
  private templateId = 'template_e6993bh';  // Tu Template ID
  private userId = 'vU6RS7XXKrrIEBvjq';  // Tu User ID

  constructor() { }

  // Método para convertir una imagen a Base64
  private convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  // Método para enviar la confirmación de la reserva
  async sendReservationConfirmation(reserva: Reserva, qrFile: File): Promise<void> {
    try {
      const qrBase64 = `data:image/png;base64,${await this.convertToBase64(qrFile)}`;

      const templateParams = {
        to_name: `${reserva.usuario?.nombre} ${reserva.usuario?.apellido}`,
        to_email: reserva.usuario?.email,  // Correo electrónico del usuario
        from_name: 'Las Perlas',
        fecha_reserva: reserva.fecha,
        hora: reserva.hora,
        numero_asistentes: reserva.numeroAsistentes,
        servicios: this.getServiciosList(reserva.servicios),
        qr_image_url: qrBase64, // Insertar la imagen QR en Base64
      };

      // Enviar el correo usando EmailJS
      await emailjs.send(this.serviceId, this.templateId, templateParams, this.userId);
      console.log('Correo enviado con éxito!');
    } catch (err) {
      console.error('Error al enviar el correo:', err);
    }
  }

  private getServiciosList(servicios: any[]): string {
    return servicios.map(servicio => servicio.nombre).join(', ');
  }
}
