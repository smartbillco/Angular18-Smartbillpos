import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges, Output, EventEmitter, ElementRef } from '@angular/core';
import { Chart, ChartType, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Company } from '../../../pages/rendiciones/file-upload-invoice/file-upload-invoice.component';
import { ChartUtilsService } from '../../../../services/chart-utils.service';

// Registrar Chart.js y el plugin ChartDataLabels
Chart.register(...registerables);
Chart.register(ChartDataLabels);

@Component({
  selector: 'app-invoice-total-chart',
  templateUrl: './invoice-total-chart.component.html',
  styleUrl: './invoice-total-chart.component.css'
})
export class InvoiceTotalChartComponent implements OnInit, OnDestroy, OnChanges {
  @Input() height: string = '100%';
  @Input() width: string = '100%';
  @Input() companiesOriginal: Company[] = [];
  @Input() chartType: ChartType = 'bar';


  @Output() companiesOriginalChanged = new EventEmitter<Company[]>();



  delayed: boolean = false;
  chart: Chart | undefined;
  hasData: boolean = false;

  constructor(private elementRef: ElementRef, private chartUtils: ChartUtilsService) {}

  ngOnInit(): void {
    this.updateChartData();
  }

  ngAfterViewInit(): void {
    this.createChart();
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['companiesOriginal'] && !changes['companiesOriginal'].firstChange) {
      this.updateChartData();
    }
    if (changes['chartType'] && !changes['chartType'].firstChange) {
      this.updateChartData();
    }
  }



  onChartTypeChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.chartType = selectElement.value as ChartType;
    this.updateChartData();
  }




  updateChartData(): void {
    if (this.chart) {
      this.chart.destroy();
    }

    this.hasData = this.companiesOriginal && this.companiesOriginal.length > 0;
    if (!this.hasData) {
      console.warn('No hay datos disponibles para mostrar en el gráfico.');
      return;
    }

    this.createChart();
  }

  private createChart(): void {
    const ctx = this.elementRef.nativeElement.querySelector('#miniChartInvoice') as HTMLCanvasElement;
    if (!ctx) {
      console.error('Elemento canvas no encontrado');
      return;
    }
  
    const colors = this.companiesOriginal.map(() => this.chartUtils.generateRandomColor());
    const nombresAbreviados = this.companiesOriginal.map(company => this.chartUtils.abreviarNombreEmpresa(company.registrationName));
    const nombresCompletos = this.companiesOriginal.map(company => company.registrationName);
    const totalFacturado = this.companiesOriginal.map(company => company.totalFacturado);
    const totalGeneral = totalFacturado.reduce((sum, val) => sum + val, 0);
  
    this.chart = new Chart(ctx, {
      type: this.chartType,
      data: {
        labels: nombresAbreviados,
        datasets: [{
          label: 'Total Facturado',
          data: totalFacturado,
          backgroundColor: colors.map(color => this.chartUtils.addAlpha(color, 0.6)),
          borderColor: colors.map(color => this.chartUtils.lightenColor(color)),
          borderWidth: 1
        }]
      },
      options: {
        indexAxis: 'x',
        responsive: true,
        animation: {
          onComplete: () => {
            this.delayed = true;
          },
          delay: (context) => {
            let delay = 0;
            if (context.type === 'data' && context.mode === 'default' && !this.delayed) {
              delay = context.dataIndex * 50 + context.datasetIndex * 100;
            }
            return delay;
          },
        },
        maintainAspectRatio: false,
        scales: {
          x: { display: false },
          y: { display: false, beginAtZero: true }
        },
        plugins: {
          legend: {
            position: 'top',
            display: false,
          },
          title: {
            display: false,
            text: 'Distribución de Gasto en Compras'
          },
          tooltip: {
            position: 'nearest',
            callbacks: {
              label: (tooltipItem) => {
                const index = tooltipItem.dataIndex;
                const amount = totalFacturado[index];
                const formattedAmount = this.chartUtils.formatCurrency(amount);
                const percentage = ((amount / totalGeneral) * 100).toFixed(1);
                return [
                  `(${percentage}%)`,
                  ` ${formattedAmount}`,
                  `${nombresCompletos[index]}`
                ];
              }
            }
          },
          datalabels: {
            display: false,
            anchor: 'end',
            align: 'center',
            color: '#000',
            font: {
              weight: 'bold'
            },
            formatter: (value) => `${((value / totalFacturado.reduce((sum, val) => sum + val, 0)) * 100).toFixed(1)}%`
          }
        }
      },
      plugins: [ChartDataLabels]
    });
  
    // Emite solo uno de los eventos, por ejemplo:
    this.companiesOriginalChanged.emit(this.companiesOriginal);
  }
}