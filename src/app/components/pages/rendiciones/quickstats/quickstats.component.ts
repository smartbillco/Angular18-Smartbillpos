import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Company } from '../file-upload-invoice/file-upload-invoice.component';
import { ExcelExportService } from   '../../../../services/excel-export.service'; // Importa el servicio de exportación a Excel
import { PdfExportService  } from   '../../../../services/pdfexport.service'; // Importa el servicio de exportación a Excel

@Component({
  selector: 'app-quickstats',
  templateUrl: './quickstats.component.html',
  styleUrls: ['./quickstats.component.css']
})
//export class QuickstatsComponent implements OnInit, OnChanges {

export class QuickstatsComponent implements OnInit {

  @Input() totalFacturado: number = 0;  // Recibir totalFacturado como entrada
  @Input() totalFacturadoFiltrado: number = 0;  // Recibir totalFacturadoFiltrado como entrada
  @Input() companiesChart: Company[] = [];
  @Input() companiesOriginal: Company[] = [];

  showDetails = false;

    
  constructor(

    private excelExportService: ExcelExportService ,
    private pdfExportService: PdfExportService,


  ) {}

  exportCompaniesToPdf(): void {
    this.pdfExportService.exportToPdf(this.companiesOriginal, 'Companies_Invoices');
  }

  exportCompaniesToExcel(): void {
    this.excelExportService.exportToExcel(this.companiesOriginal, 'Companies_Invoices');
  }

  exportCompaniesFiltToPdf(): void {
    this.pdfExportService.exportToPdf(this.companiesChart, 'Companies_Invoices_Filt');
  }

  exportCompaniesFiltToExcel(): void {
    this.excelExportService.exportToExcel(this.companiesChart, 'Companies_Invoices_Filt');
  }

  ngOnInit(): void {
    //.log('QuickstatsComponent initialized');
  }

  onCompaniesOriginalChanged(companiesOriginal: Company[]): void {
    this.companiesOriginal = companiesOriginal;
    //console.log('onCompaniesOriginalChanged called:', companiesOriginal);
    console.log("paso: "+JSON.stringify(this.companiesOriginal, null, 2));
  }

  onCompaniesChartChanged(companiesChart: Company[]): void {
    this.companiesChart = companiesChart;
    //.log('onCompaniesChartChanged called:', companiesChart);
  }


  /*
  // Hook para detectar cambios en las entradas
  ngOnChanges(changes: SimpleChanges): void {
    console.log('ngOnChanges called', changes);
    if (changes['companiesOriginal']) {
      this.showChartData();
    }
    // Puedes agregar más condiciones para otros cambios si es necesario
  }

  showChartData() {
    // Lógica para mostrar datos
    console.log('Contenido de companiesOriginal:', this.companiesOriginal);
  }*/
}