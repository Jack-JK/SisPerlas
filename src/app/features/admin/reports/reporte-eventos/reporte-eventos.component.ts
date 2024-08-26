import { Component, OnInit } from '@angular/core';
import { ReservaService } from '../../../../core/services/reserva.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-reporte-eventos',
  templateUrl: './reporte-eventos.component.html',
  styleUrls: ['./reporte-eventos.component.css']
})
export class ReporteEventosComponent implements OnInit {

  constructor(private reservaService: ReservaService) { }

  ngOnInit(): void {
    this.reservaService.getReservasConEventos().subscribe(
      reservasConEventos => {
        this.renderChart(reservasConEventos);
      },
      error => {
        console.error('Error al obtener las reservas con eventos:', error);
      }
    );
  }

  renderChart(reservasConEventos: { fecha: string }[]): void {
    // Agrupar las reservas por fecha
    const reservasPorFecha = reservasConEventos.reduce((acc, reserva) => {
      const fecha = reserva.fecha;
      if (!acc[fecha]) {
        acc[fecha] = 0;
      }
      acc[fecha]++;
      return acc;
    }, {} as Record<string, number>);

    // Preparar datos para el gráfico
    const fechas = Object.keys(reservasPorFecha);
    const conteo = Object.values(reservasPorFecha);

    const ctx = document.getElementById('eventosChart') as HTMLCanvasElement;
    if (!ctx) {
      console.error('No se encontró el elemento con id "eventosChart".');
      return;
    }

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: fechas,
        datasets: [{
          label: 'Número de Eventos',
          data: conteo,
          backgroundColor: 'rgba(75, 192, 192, 0.5)', // Color de las barras
          borderColor: 'rgba(75, 192, 192, 1)', // Color del borde de las barras
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: '#fff'
            }
          },
          title: {
            display: true,
            text: 'Número de Eventos por Fecha',
            color: '#fff'
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            grid: {
              color: 'rgba(255, 255, 255, 0.2)'
            },
            ticks: {
              color: '#fff'
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(255, 255, 255, 0.2)'
            },
            ticks: {
              color: '#fff'
            }
          }
        }
      }
    });
  }

}
