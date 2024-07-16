import { Component, Input, OnInit, OnDestroy, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import Chart from 'chart.js/auto';
import { Company } from '../company-invoice-list/company-invoice-list.component';

@Component({
  selector: 'app-company-invoice-chart',
  templateUrl: './company-invoice-chart.component.html',
  styleUrls: ['./company-invoice-chart.component.css']
})
export class CompanyInvoiceChartComponent implements OnInit, OnDestroy, OnChanges {
  @Input() companiesChart: Company[] = [];
  chart: Chart | undefined;

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.updateChartData();
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['companiesChart'] && !changes['companiesChart'].firstChange) {
      this.updateChartData();
    }
  }

  updateChartData(): void {
    if (this.companiesChart && this.companiesChart.length > 0) {
      const ctx = this.elementRef.nativeElement.querySelector('#myChart');
      if (!ctx) {
        console.error('Elemento canvas no encontrado');
        return;
      }

      // Obtener nombres abreviados y completos de las empresas
      const nombresEmpresas = this.companiesChart.map(company => this.abreviarNombreEmpresa(company.registrationName));
      const nombresCompletosEmpresas = this.companiesChart.map(company => company.registrationName);
      const totalFacturado = this.companiesChart.map(company => company.totalFacturado);

      if (this.chart) {
        this.chart.destroy();
      }

      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: nombresEmpresas,
          datasets: [{
            label: 'Total Facturado',
            data: totalFacturado,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: { beginAtZero: true }
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: (tooltipItem) => {
                  const index = tooltipItem.dataIndex;
                  return nombresCompletosEmpresas[index];
                }
              }
            },
            legend: {
              display: true,
              position: 'bottom',
              labels: {
                font: { size: 14 }
              }
            }
          }
        }
      });
    }
  }

  abreviarNombreEmpresa(nombreEmpresa: string): string {
    // Lógica para abreviar el nombre de la empresa, por ejemplo, tomar las primeras letras
    const palabras = nombreEmpresa.split(' ');
    const abreviado = palabras.map(palabra => palabra.charAt(0)).join('');
    return abreviado;
  }
}