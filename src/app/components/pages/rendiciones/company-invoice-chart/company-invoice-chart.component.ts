import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges, Output, EventEmitter, ElementRef } from '@angular/core';
import { Chart, ChartType, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Company } from '../../../pages/rendiciones/file-upload-invoice/file-upload-invoice.component';
import { ChartUtilsService } from '../../../../services/chart-utils.service';

// Registrar Chart.js y el plugin ChartDataLabels
Chart.register(...registerables);
Chart.register(ChartDataLabels);

@Component({
  selector: 'app-company-invoice-chart',
  templateUrl: './company-invoice-chart.component.html',
  styleUrls: ['./company-invoice-chart.component.css']
})
export class CompanyInvoiceChartComponent implements OnInit, OnDestroy, OnChanges {
  // Propiedades de entrada y salida del componente
  @Input() companiesChart: Company[] = [];
  @Input() chartType: ChartType = 'bar'; // Tipo de gráfico por defecto
  @Output() companiesChartChanged = new EventEmitter<Company[]>(); // Evento para cambios en los datos del gráfico
  delayed: boolean = false; // Variable para manejar el retraso en la animación

  chart: Chart | undefined; // Instancia del gráfico
  hasData: boolean = false; // Indicador de si hay datos para mostrar

  constructor(private elementRef: ElementRef, private chartUtils: ChartUtilsService) {}

  // Inicializar el componente
  ngOnInit(): void {
    this.updateChartData(); // Actualizar datos del gráfico al iniciar
  }

  // Destruir el gráfico al destruir el componente
  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  // Manejar cambios en las propiedades de entrada
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['companiesChart'] && !changes['companiesChart'].firstChange) {
      this.updateChartData(); // Actualizar datos del gráfico si cambia companiesChart
    }

    if (changes['chartType'] && !changes['chartType'].firstChange) {
      this.updateChartData(); // Actualizar datos del gráfico si cambia chartType
    }
  }

  // Actualizar los datos del gráfico
  updateChartData(): void {
    if (this.chart) {
      this.chart.destroy(); // Destruir gráfico existente antes de crear uno nuevo
    }

    // Verificar si hay datos
    this.hasData = this.companiesChart && this.companiesChart.length > 0;

    // Si no hay datos, no crear el gráfico
    if (!this.hasData) {
      console.warn('No hay datos disponibles para mostrar en el gráfico.');
      return;
    }

    const ctx = this.elementRef.nativeElement.querySelector('#myChart') as HTMLCanvasElement;
    if (!ctx) {
      console.error('Elemento canvas no encontrado'); // Manejar error si no se encuentra el elemento canvas
      return;
    }

    // Obtener los datos necesarios para el gráfico
    const nombresCompletos = this.companiesChart.map(company => company.registrationName);
    const nombresAbreviados = this.companiesChart.map(company => this.chartUtils.abreviarNombreEmpresa(company.registrationName));
    const totalFacturado = this.companiesChart.map(company => company.totalFacturado);
    const totalGeneral = totalFacturado.reduce((sum, val) => sum + val, 0); // Calcular el total general facturado
    const colors = this.companiesChart.map(() => this.chartUtils.generateRandomColor());
    
        // Variable para manejar el retraso en la animación
        this.delayed = false;

    // Crear la nueva instancia del gráfico
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
          y: { display: true, beginAtZero: true }
        },
        plugins: {
          legend: {
            position: 'top',
            display: false,
          },
          title: {
            display: true,
            text: 'Distribución de Gasto en Compras'
          },
          tooltip: {
            callbacks: {
              label: (tooltipItem) => {
                const index = tooltipItem.dataIndex;
                const amount = totalFacturado[index];
                const formattedAmount = this.chartUtils.formatCurrency(amount);
                const percentage = ((amount / totalGeneral) * 100).toFixed(1); // Calcular el porcentaje
                return `${nombresCompletos[index]}: ${formattedAmount} (${percentage}%)`;

              }
            }
          },
          datalabels: {
              display: false,    // Desactivar los labels dentro de la gráfica
              anchor:  'end',    // Posiciona el label en el centro del segmento
                                  //'center' (default): element center
                                  //'start': lowest element boundary
                                  //'end': highest element boundary
              align:   'center', // Alinea el label en el centro del segmento
              color:   '#000',   // Color negro para los labels
              font: {
                weight:'bold'
              },
              formatter: (value) => `${((value / totalFacturado.reduce((sum, val) => sum + val, 0)) * 100).toFixed(1)}%`
          }
        }
      },
      plugins: [ChartDataLabels]
    });

    // Emitir evento cuando los datos del gráfico cambian
    this.companiesChartChanged.emit(this.companiesChart);
  }

  // Manejar cambios en el tipo de gráfico
  onChartTypeChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.chartType = selectElement.value as ChartType;
    this.updateChartData(); // Actualizar los datos del gráfico al cambiar el tipo de gráfico
  }


}