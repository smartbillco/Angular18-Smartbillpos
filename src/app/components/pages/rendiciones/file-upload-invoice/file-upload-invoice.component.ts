import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FileUploadService } from '../../../../services/rendicion/file-upload.service';
import { FilterInvoiceService } from '../../../../services/filter-invoice.service'; // Importa el servicio
import { ToastrService } from 'ngx-toastr';
import { ExcelExportService } from   '../../../../services/excel-export.service'; // Importa el servicio de exportación a Excel
import { PdfExportService  } from   '../../../../services/pdfexport.service'; // Importa el servicio de exportación a Excel

import moment from 'moment';

// Interface para la estructura de datos de la compañía
export interface Company {
  expanded: boolean;  
  validated: 'pending' | 'valid' | 'invalid';  
  id: string; 
  registrationName: string;  // Nombre de registro de la compañía
  totalFacturado: number;  // Total facturado por la compañía
  invoices: Invoice[];  // Lista de facturas de la compañía
}

// Interface para la estructura de datos de la factura
export interface Invoice {
  expanded: boolean;  
  documentReference: string;  // Referencia del documento de la factura
  issueDate: Date;  // Fecha de emisión de la factura
  issueTime: string;  // Hora de emisión de la factura
  totalFactura: number;  // Total de la factura
  description_Xml_Hijo_Json: any;  // Descripción del XML hijo en formato JSON
  descriptionsItem: string[];  // Descripciones de los ítems de la factura
  precioItem: number[];  // Precios de los ítems de la factura
}

// Interface para la estructura de datos del archivo cargado
export interface UploadedFile {
  file: File;  // Archivo cargado
  status: 'invalid' | 'valid' | 'pending';  // Estado de validación del archivo
}

@Component({
  selector: 'app-file-upload-invoice',
  templateUrl: './file-upload-invoice.component.html',
  styleUrls: ['./file-upload-invoice.component.css']
})
export class FileUploadInvoiceComponent implements OnInit {
  files: UploadedFile[] = [];  // Lista de archivos cargados
  companies: Company[] = [];  // Lista de compañías
  companiesOriginal: Company[] = [];  // Copia original de la lista de compañías para filtros
  totalFacturado: number = 0;  // Total facturado por todas las compañías
  companiesChart: Company[] = [];  // Lista de compañías para el gráfico
  showInvoiceInfo = false;  // Indica si se muestra la información de la factura
  processing = false;  // Indica si se están procesando archivos
  isMaximized = false;  // Indica si el componente está maximizado
 
  @Output() companiesOriginalChanged      = new EventEmitter<Company[]>();  // Evento para notificar cambios en la compañías
  @Output() companiesChartChanged         = new EventEmitter<Company[]>();  // Evento para notificar cambios en el gráfico de compañías
  @Output() totalFacturadoChanged         = new EventEmitter<number>();  //  Evento para notificar cambios valor de totalFacturado 
  @Output() totalFacturadoFiltradoChanged = new EventEmitter<number>();  //  Evento para notificar cambios valor filtrado

  
  constructor(
    private fileUploadService: FileUploadService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private filterService: FilterInvoiceService, 
    private excelExportService: ExcelExportService, // Agrega el servicio de exportación a Excel    private pdfExportService: PdfExportService
    private pdfExportService: PdfExportService,
  ) {}

  ngOnInit(): void {}

  // Maneja la selección de archivos a través de la interfaz
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.processFiles(input.files);
    }
  }

  // Maneja el evento de arrastrar sobre el área de carga de archivos
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const element = event.target as HTMLElement;
    element.classList.add('dragover');
  }

  // Maneja el evento de dejar el área de arrastrar archivos
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const element = event.target as HTMLElement;
    element.classList.remove('dragover');
  }

  // Maneja el evento de soltar archivos en el área de carga
  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const element = event.target as HTMLElement;
    element.classList.remove('dragover');
    if (event.dataTransfer) {
      this.processFiles(event.dataTransfer.files);
    }
  }

  // Procesa los archivos cargados
  async processFiles(files: FileList | File[]): Promise<void> {
    this.processing = true;    
    this.showInvoiceInfo = true; 
    //this.totalFacturado = 0;
    try {
      const { companies, totalFacturado, processedFiles } = await this.fileUploadService.processFiles(files, this.companies, this.totalFacturado);
      this.companies = companies;
      this.companiesOriginal = [...companies];
      this.totalFacturado = totalFacturado;
      this.files = processedFiles;
      this.loadCompaniesChart();

      this.totalFacturadoChanged.emit(this.totalFacturado);  // Emitir el valor de totalFacturado
      this.companiesOriginalChanged.emit(this.companiesOriginal); 

      //console.log('companiesOriginal emitido:', this.companiesOriginal);
      
    } catch (error) {
      console.error('Error during file processing:', error);
      this.toastr.error('Error processing files');
    } finally {
      this.processing = false;
    }
  }

  // Alterna la expansión de un ítem (compañía o factura) en la interfaz
  toggleExpansion<T extends { expanded: boolean }>(item: T): void {
    item.expanded = !item.expanded;
  }

  // Limpia la lista de compañías y reinicia el estado
  clearCompanyList(): void {
    this.companies = [];
    this.totalFacturado = 0;
    this.files = [];
    this.loadCompaniesChart();
  }

  // Limpia los filtros aplicados
  clearFilter(): void {
    this.companies = [...this.companiesOriginal];
    this.loadCompaniesChart();
    this.companiesChartChanged.emit(this.companiesChart);


  }

  // Devuelve información sobre el estado del archivo (clase CSS y etiqueta)
  getFileStatusInfo(status: 'invalid' | 'valid' | 'pending' | undefined): { class: string, label: string } {
    const info: { [key in 'invalid' | 'valid' | 'pending']: { class: string; label: string } } = {
      invalid: { class: 'invalid-file', label: '✘' },
      valid: { class: 'valid-file', label: '✔' },
      pending: { class: 'pending-file', label: '*' }
    };
  
    // Usa un valor predeterminado si status es undefined
    const statusKey = status || 'invalid';
    return info[statusKey];
  }

  // Alterna el estado de maximización del componente
  toggleMaximize(): void {
    this.isMaximized = !this.isMaximized;
  }

      // Aplica filtros a la lista de compañías usando el servicio
  applyFilter(filter: { name?: string; startDate?: Date; endDate?: Date }): void {
    this.companies = this.filterService.applyFilter(this.companiesOriginal, filter);
    this.updateTotals();
    this.loadCompaniesChart();
  }


  // Actualiza los totales de facturación
  updateTotals(): void { 
    this.totalFacturado = this.companies.reduce((acc, company) => acc + company.totalFacturado, 0);
    this.totalFacturadoFiltradoChanged.emit(this.totalFacturado);  // Emitir el valor de totalFacturado

  }

  // Carga las compañías válidas en el gráfico
  loadCompaniesChart(): void {   
    this.companiesChart = this.companies.filter(company => company.validated === 'valid');
    this.cdr.detectChanges();
    this.companiesChartChanged.emit(this.companiesChart);
  }  

  exportCompaniesToExcel(): void {
    this.excelExportService.exportToExcel(this.companies, 'Companies_Invoices');
  }
  
    downloadPdf(): void {
    const fileName = 'invoices';
    this.pdfExportService.exportToPdf(this.companies, fileName);
  }
}