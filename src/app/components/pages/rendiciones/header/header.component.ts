import { Component } from '@angular/core';
import { FilterInvoiceService } from '../../../../services/filter-invoice.service'; // Importa el servicio

@Component({
  selector: 'app-header-inv',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {


  constructor(

    private filterService: FilterInvoiceService, 

  ) {}

  // Aplica filtros a la lista de compañías usando el servicio
  applyFilter(filter: { name?: string; startDate?: Date; endDate?: Date }): void {
   // this.companies = this.filterService.applyFilter(this.companiesOriginal, filter);
    this.updateTotals();
    this.loadCompaniesChart();
  }

  // Actualiza los totales de facturación
  updateTotals(): void { 
    //this.totalFacturado = this.companies.reduce((acc, company) => acc + company.totalFacturado, 0);
    //this.totalFacturadoFiltradoChanged.emit(this.totalFacturado);  // Emitir el valor de totalFacturado

  }

    // Carga las compañías válidas en el gráfico
loadCompaniesChart(): void {   
  //this.updateTotals();
  //this.companiesChart = this.companies.filter(company => company.validated === 'valid');
  //this.cdr.detectChanges();
  //this.companiesChartChanged.emit(this.companiesChart);
}  

}
