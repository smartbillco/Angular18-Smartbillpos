import { Injectable } from '@angular/core';
import { Chart, ChartType, BarElement, Title, Tooltip, Legend, LinearScale, CategoryScale } from 'chart.js';
import 'chartjs-plugin-datalabels';

@Injectable({
  providedIn: 'root'
})
export class ChartService {
  constructor() {
    // Registrar todos los componentes necesarios de Chart.js
    Chart.register(
      BarElement,    // Registrar el controlador de tipo 'bar'
      LinearScale,   // Registrar la escala lineal
      CategoryScale, // Registrar la escala de categorías
      Title,         // Registrar el plugin de título
      Tooltip,       // Registrar el plugin de tooltip
      Legend         // Registrar el plugin de leyenda
    );
  }

  createChart(
    ctx: CanvasRenderingContext2D,
    chartType: ChartType,
    labels: string[],
    data: number[],
    colors: string[]
  ): Chart {
    return new Chart(ctx, {
      type: chartType,
      data: {
        labels,
        datasets: [{
          label: 'Total Facturado',
          data,
          backgroundColor: chartType === 'pie' ? colors : 'rgba(54, 162, 235, 0.2)',
          borderColor: chartType === 'pie' ? 'rgba(255, 255, 255, 1)' : 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: chartType === 'pie' ? undefined : { beginAtZero: true }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (tooltipItem) => this.tooltipLabel(tooltipItem, data, labels)
            }
          },
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              font: { size: 14 }
            }
          },
          datalabels: {
            color: '#fff',
            formatter: (value, context) => this.formatDataLabel(value, context),
            anchor: 'center',
            align: 'center',
            font: {
              weight: 'bold'
            }
          }
        }
      }
    });
  }

  private tooltipLabel(tooltipItem: any, data: number[], labels: string[]): string {
    const index = tooltipItem.dataIndex;
    const amount = data[index];
    const total = data.reduce((sum, value) => sum + value, 0);
    const percentage = total > 0 ? ((amount || 0) / total * 100).toFixed(2) : '0.00';
    return `${labels[index]}: ${amount} (${percentage}%)`;
  }

  private formatDataLabel(value: number, context: any): string {
    const total = (context.chart.data.datasets[0].data as number[])
      .filter((val: any) => typeof val === 'number')
      .reduce((sum: number, val: number) => sum + val, 0);
    const percentage = total > 0
      ? ((value / total) * 100).toFixed(2) + '%'
      : '0.00%';
    return percentage;
  }
}