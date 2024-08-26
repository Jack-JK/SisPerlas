import { Component, OnInit } from '@angular/core';
import { ReservaService } from '../../../../core/services/reserva.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-reporte-reserva',
  templateUrl: './reporte-reserva.component.html',
  styleUrls: ['./reporte-reserva.component.css']
})
export class ReporteReservaComponent implements OnInit {

  constructor(private reservaService: ReservaService) { }

  ngOnInit(): void {
    this.reservaService.getReservasPorEstado().subscribe(
      reservasPorEstado => {
        this.renderChart(reservasPorEstado);
      },
      error => {
        console.error('Error al obtener las reservas por estado:', error);
      }
    );
  }

  renderChart(reservasPorEstado: { estado: string; cantidad: number }[]): void {
    const labels = reservasPorEstado.map(reserva => reserva.estado);
    const data = reservasPorEstado.map(reserva => reserva.cantidad);

    const ctx = document.getElementById('reservasChart') as HTMLCanvasElement;
    if (!ctx) {
      console.error('No se encontró el elemento con id "reservasChart".');
      return;
    }

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          label: 'Distribución de Reservas por Estado',
          data: data,
          backgroundColor: [
            '#FF6384',  // Rojo
            '#36A2EB',  // Azul
            '#FFCE56',  // Amarillo
            '#4BC0C0',  // Verde Claro
            '#9966FF'   // Lila
          ],
          borderColor: '#fff',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: '#333'
            }
          },
          title: {
            display: true,
            text: 'Distribución de Reservas por Estado',
            color: '#333',
            font: {
              size: 16,
              weight: 'bold'
            }
          },
          tooltip: {
            callbacks: {
              label: function(tooltipItem) {
                return `${tooltipItem.label}: ${tooltipItem.raw} reservas`;
              }
            }
          }
        }
      }
    });
  }
}
