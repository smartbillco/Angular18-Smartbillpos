import { Component, Input } from '@angular/core';
import { Company } from '../../rendiciones/file-upload-invoice/file-upload-invoice.component'; // Ajusta la ruta según sea necesario

@Component({
  selector: 'app-dashboard-accountability',
  templateUrl: './dashboard-accountability.component.html',
  styleUrls: ['./dashboard-accountability.component.css'] // Corregido: 'styleUrl' a 'styleUrls'
})
export class DashboardAccountabilityComponent {
  companiesChart: Company[] = [];
  companiesOriginal: Company[] = [];

  @Input() chartType: string = 'bar'; // Tipo de gráfico por defecto

  totalFacturado: number = 0;  
  totalFacturadoFiltrado: number = 0;  

  onTotalFacturadoFiltradoChanged(totalFacturadoFiltrado: number): void {
  this.totalFacturadoFiltrado = totalFacturadoFiltrado;
  }

  onTotalFacturadoChanged(totalFacturado: number): void {
    this.totalFacturado = totalFacturado;
  }

  onCompaniesChartChanged(companiesChart: Company[]): void {
    this.companiesChart = companiesChart;
  }

    
  onCompaniesOriginalChanged(companiesOriginal: Company[]): void {
    //alert("aqui"+companiesOriginal);
    //console.log("aqui: "+JSON.stringify(companiesOriginal, null, 2));
    //alert("aqui: "+JSON.stringify(companiesOriginal, null, 2));

    this.companiesOriginal  =companiesOriginal;
  }
  

  // Configuración del gráfico
  public chartOptions: any = {
    responsive: true,
    // Otras opciones del gráfico
  };
  

  ngOnInit() {
    this.initializeChart();
  }

  initializeChart() {
    // Inicializa el gráfico con los datos y el tipo de gráfico
    this.chartOptions.type = this.chartType;

    // Configurar chartData y chartLabels aquí
  }
  
}