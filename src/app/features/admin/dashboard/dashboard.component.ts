import { Component, OnInit } from '@angular/core';
import { ReservaService } from '../../../core/services/reserva.service';
import { ServicioService } from '../../../core/services/servicio.service'; // Asegúrate de tener este servicio
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  showReportesMenu = false;
  userName: string = '';
  pendingReservationsCount = 0;
  popularServicesCount = 0;
  totalReservationsMonth = 0;
  isModalOpen = false;
  shotcontent: boolean=true;

  constructor(
    private reservaService: ReservaService, 
    private servicioService: ServicioService, // Servicio para manejar los servicios
    private authService: AuthService, 
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPendingReservations();
    this.loadPopularServices();
    this.loadTotalReservationsMonth();
    this.initializeLogout();
    this.authService.getUserName().subscribe(name => {
      this.userName = name;
      this.initializeLogout();
    });
    this.router.events.subscribe(()=>{
      this.shotcontent=this.router.url==='/admin';
    });
  }

  loadPendingReservations() {
    this.reservaService.getReservas().subscribe(reservas => {
      const pendingReservations = reservas.filter(reserva => reserva.estado === 'Pendiente');
      this.pendingReservationsCount = pendingReservations.length;
    });
  }

  loadPopularServices() {
    this.reservaService.getReservasConServicios().subscribe(reservas => {
      // Crear un mapa para contar la cantidad de veces que aparece cada servicio en las reservas
      const serviceCountMap = new Map<string, number>();

      reservas.forEach(reserva => {
        reserva.servicios?.forEach(servicio => {
          const currentCount = serviceCountMap.get(servicio.id) || 0;
          serviceCountMap.set(servicio.id, currentCount + 1); // Incrementar el contador
        });
      });

      // Obtener todos los servicios y ordenar por cantidad de veces que aparecen en las reservas
      this.servicioService.getServicios().subscribe(servicios => {
        const sortedServicios = servicios.sort((a, b) => {
          const countA = serviceCountMap.get(a.id) || 0;
          const countB = serviceCountMap.get(b.id) || 0;
          return countB - countA; // Ordenar de mayor a menor cantidad
        });

        // Mostrar el conteo del servicio más popular
        this.popularServicesCount = sortedServicios.length ? serviceCountMap.get(sortedServicios[0].id) || 0 : 0;
      });
    });
  }
  loadTotalReservationsMonth() {
    const currentMonth = new Date().getMonth() + 1; // Mes actual (1 basado)
    this.reservaService.getReservas().subscribe(reservas => {
      const reservasDelMes = reservas.filter(reserva => {
        const reservaDate = new Date(reserva.fecha);
        return reservaDate.getMonth() + 1 === currentMonth;
      });
      this.totalReservationsMonth = reservasDelMes.length;
    });
  }

  toggleReportesMenu() {
    this.showReportesMenu = !this.showReportesMenu;
  }

  toggleMobileMenu() {
    const mobileAside = document.getElementById('mobile-aside');
    if (mobileAside) {
      if (mobileAside.classList.contains('-translate-x-full')) {
        mobileAside.classList.remove('-translate-x-full');
        mobileAside.classList.add('translate-x-0');
      } else {
        mobileAside.classList.remove('translate-x-0');
        mobileAside.classList.add('-translate-x-full');
      }
    }
  }

  initializeLogout() {
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
      logoutButton.addEventListener('click', () => {
        Swal.fire({
          title: `Hola, ${this.userName}`,
          text: '¿Deseas cerrar sesión?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, cerrar sesión',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
            this.authService.logout().then(() => {
              this.router.navigate(['/auth/login']);
            });
          }
        });
      });
    }
  }

  toggleModal() {
    this.isModalOpen = !this.isModalOpen;
  }
}
