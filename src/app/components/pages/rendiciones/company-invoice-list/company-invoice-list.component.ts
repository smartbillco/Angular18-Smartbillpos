import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FileUploadService } from '../../../../services/rendicion/file-upload.service';

export interface Company {
  registrationName: string;
  totalFacturado: number;
  invoices: Invoice[];

  expanded: boolean;
}

export interface Invoice {
  documentReference: string;
  issueDate: Date;
  issueTime: string;
  totalFactura: number;
  description_Xml_Hijo_Json: any;
  descriptionsItem: string[];
  precioItem: number[]; 

  expanded: boolean;
}

export interface UploadedFile { 
  file: File;
  validated: 'pending' | 'valid' | 'invalid'; 
  expanded: boolean;
  
  companyName: string;
  descriptionsItem: string[]; 
  precioItem: number[];
  facturaNumber: string;
  fechaFactura: Date;
  timefactura: string;  
  totalFactura: number;
  description_Xml_Hijo_Json: any | undefined;
}


@Component({
  selector: 'app-company-invoice-list',
  templateUrl: './company-invoice-list.component.html',
  styleUrls: ['./company-invoice-list.component.css']
})
export class CompanyInvoiceListComponent implements OnInit {
  files: UploadedFile[] = []; // Array para almacenar los archivos subidos
  companies: Company[] = [];
  totalFacturado: number = 0;  
  companiesChart: Company[] = []; // Inicializa como un array vacío
  showInvoiceInfo     = false; 
  processing: boolean = false;

  constructor(
    private fileUploadService: FileUploadService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
  }

  loadCompaniesChart(): void {
    this.companiesChart = [...this.companies]; // Copiar el arreglo de companies a companiesChart
    console.log('Datos cargados en company-invoice-list.component:', this.companiesChart);
  }

  // Manejar la selección de archivos desde input
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.processFiles(input.files);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const element = event.target as HTMLElement;
    element.classList.add('dragover');
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const element = event.target as HTMLElement;
    element.classList.remove('dragover');
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const element = event.target as HTMLElement;
    element.classList.remove('dragover');

    if (event.dataTransfer) {
      this.processFiles(event.dataTransfer.files);
    }
  }

  async processFiles(files: FileList | File[]): Promise<void> {
    this.processing = true;
    this.showInvoiceInfo = true;
    this.totalFacturado = 0;

    const { companies, totalFacturado } = await this.fileUploadService.processFiles(files, this.companies, this.totalFacturado);
    this.companies = companies;
    this.totalFacturado = totalFacturado;
    this.loadCompaniesChart();

    this.processing = false;
  }

  toggleCompany(company: Company): void {
    company.expanded = !company.expanded;
  }

  toggleInvoice(invoice: Invoice): void {
    invoice.expanded = !invoice.expanded;
  }

  clearCompanyList(): void {
    this.companies = [];
    this.totalFacturado = 0;
    this.loadCompaniesChart(); // Actualizar companiesChart después de limpiar la lista de empresas
  }
}