import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Chart } from 'chart.js';
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
  styleUrls: ['./panel.component.css'],
  standalone: false,
})
export class PanelComponent implements AfterViewInit {
  cargando: boolean = false;

  // Tarjetas
  cards = [
    { title: 'Citas', value: 105, bgClass: 'bg-primary' },
    { title: 'Pacientes', value: 105, bgClass: 'bg-info' },
    { title: 'Servicios', value: 100, bgClass: 'bg-success' },
  ];

  // Gráficos
  charts = [
    { id: 'myChart', title: 'Estadísticas', icon: 'fas fa-chart-line' },
    { id: 'pieChart', title: 'Servicios Usados', icon: 'fas fa-chart-pie' },
    { id: 'barChart', title: 'Rango de Edades', icon: 'fas fa-chart-bar' },
    { id: 'genderChart', title: 'Distribución de Género', icon: 'fas fa-venus-mars' },
  ];

  constructor(private router: Router) {}

  ngAfterViewInit(): void {
    this.inicializarGraficos();
  }

  inicializarGraficos(): void {
    this.charts.forEach(chart => {
      const canvas = document.getElementById(chart.id) as HTMLCanvasElement | null;
      const ctx = canvas?.getContext('2d');

      if (ctx) {
        let config: any;

        switch (chart.id) {
          case 'myChart':
            config = {
              type: 'line',
              data: {
                labels: ['Enero', 'Febrero', 'Marzo', 'Abril'],
                datasets: [{
                  pointRadius: 6,        // Tamaño del punto (círculo)
                  pointHoverRadius: 8,   // Tamaño al pasar el mouse
                  borderWidth: 3,         // Grosor de la línea
                  label: 'Citas',
                  data: [10, 20, 30, 40],
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
          new Chart(ctx, { ...config, options: { responsive: true } });
        }
      } else {
        console.warn(`No se pudo inicializar el gráfico con id ${chart.id}`);
      }
    });
  }

  cerrarSesion(): void {
    this.cargando = true;
    setTimeout(() => {
      localStorage.removeItem('usuario');
      this.router.navigate(['/login']);
    }, 700);
  }
}
