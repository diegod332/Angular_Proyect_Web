import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Chart } from 'chart.js';
import Swal from 'sweetalert2';
import { HttpClientModule } from '@angular/common/http';

import {
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  PieController,
  ArcElement,
  BarController,
  BarElement,
  DoughnutController,
  Tooltip,
  Legend
} from 'chart.js';
import { AuthService } from '../../../auth/services/auth.service';

// Registrar los componentes necesarios
Chart.register(
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  PieController,
  ArcElement,
  BarController,
  BarElement,
  DoughnutController,
  Tooltip,
  Legend
);

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['../../admin.component.css'],
  standalone: false,
})
export class PanelComponent implements AfterViewInit, OnInit {
  cargando: boolean = false; // Indicador de carga
  cards: any[] = []; // Datos de las tarjetas
  charts: any[] = []; // Datos de los gráficos

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.obtenerDatosPanel();
  }

  ngAfterViewInit(): void {
    this.inicializarGraficos();
  }

  obtenerDatosPanel(): void {
    // Simulación de datos para las tarjetas y gráficos
    this.cards = [
      { title: 'Clientes', value: 120, bgClass: 'bg-primary' },
      { title: 'Citas', value: 45, bgClass: 'bg-success' },
      { title: 'Servicios', value: 15, bgClass: 'bg-warning' },
      { title: 'Inventario', value: 200, bgClass: 'bg-danger' },
    ];

    this.charts = [
      { title: 'Citas por Mes', icon: 'fas fa-chart-line', id: 'chartCitas' },
      { title: 'Servicios más Solicitados', icon: 'fas fa-chart-pie', id: 'chartServicios' },
    ];
  }

  inicializarGraficos(): void {
    this.charts.forEach(chart => {
      const canvas = document.getElementById(chart.id) as HTMLCanvasElement | null;
      const ctx = canvas?.getContext('2d');

      if (ctx) {
        let config: any;

        switch (chart.id) {
          case 'chartCitas':
            config = {
              type: 'line',
              data: {
                labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
                datasets: [{
                  label: 'Citas',
                  data: [10, 20, 15, 25, 30],
                  borderColor: 'rgba(75, 192, 192, 1)',
                  backgroundColor: 'rgba(75, 192, 192, 0.2)',
                  borderWidth: 2,
                  fill: true,
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false, // Permitir ajustar el tamaño
                plugins: {
                  legend: { display: true },
                  tooltip: { enabled: true }
                }
              }
            };
            break;

          case 'chartServicios':
            config = {
              type: 'pie',
              data: {
                labels: ['Limpieza', 'Ortodoncia', 'Endodoncia', 'Blanqueamiento'],
                datasets: [{
                  label: 'Servicios',
                  data: [40, 25, 20, 15],
                  backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0']
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false, // Permitir ajustar el tamaño
                plugins: {
                  legend: { display: true },
                  tooltip: { enabled: true }
                }
              }
            };
            break;

          case 'myChart':
            config = {
              type: 'line',
              data: {
                labels: ['Enero', 'Febrero', 'Marzo', 'Abril'],
                datasets: [{
                  pointRadius: 6,        
                  pointHoverRadius: 8, 
                  borderWidth: 1,         
                  label: 'Citas',
                  data: [5, 10, 30, 15, 20],
                  borderColor: 'rgba(75, 192, 192, 1)',
                  fill: false
                }]
              }
            };
            break;

          case 'pieChart':
            config = {
              type: 'pie',
              data: {
                labels: ['Limpieza', 'Ortodoncia', 'Endodoncia'],
                datasets: [{
                  label: 'Servicios',
                  data: [40, 30, 30],
                  backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56']
                }]
              }
            };
            break;

          case 'barChart':
            config = {
              type: 'bar',
              data: {
                labels: ['0-18', '19-35', '36-60', '60+'],
                datasets: [{
                  label: 'Pacientes',
                  data: [15, 25, 30, 10],
                  backgroundColor: '#4bc0c0'
                }]
              }
            };
            break;

          case 'genderChart':
            config = {
              type: 'doughnut',
              data: {
                labels: ['Masculino', 'Femenino'],
                datasets: [{
                  label: 'Género',
                  data: [60, 40],
                  backgroundColor: ['#36A2EB', '#FF6384']
                }]
              }
            };
            break;
        }

        if (config) {
          new Chart(ctx, config);
        }
      } else {
        console.warn(`No se pudo inicializar el gráfico con id ${chart.id}`);
      }
    });
  }

  cerrarSesion(): void {
  Swal.fire({
    title: '¿Estás seguro?',
    text: '¿Deseas cerrar sesión?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, cerrar sesión',
    cancelButtonText: 'Cancelar',
  }).then((result) => {
    if (result.isConfirmed) {
      this.cargando = true; // Muestra la pantalla de carga

      this.authService.logout().subscribe({
        next: () => {
          setTimeout(() => {
            this.cargando = false; // Oculta la pantalla de carga
            this.router.navigate(['/login']); // Redirige al login
          }, 2000); // Retraso de 2 segundos para la animación
        },
        error: (err: unknown) => {
          console.error('Error al cerrar sesión:', err);
          this.cargando = false; // Oculta la pantalla de carga en caso de error
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error al intentar cerrar sesión.',
          });
        },
      });
    }
  });
}
}