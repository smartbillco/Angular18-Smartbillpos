import { Component, OnInit } from '@angular/core';
import { XmlProcessingService } from '../../../../services/xml-processing.service';
import { InvoiceProcessingService } from '../../../../services/invoice-processing.service';
import { ToastrService } from 'ngx-toastr';

export interface Company {
  registrationName: string;
  invoices: Invoice[];
  totalFacturado: number;
  expanded: boolean;
}

export interface Invoice {
  documentReference: string;
  issueDate: Date;
  issueTime: string;
  totalFactura: number;
  description_Xml_Hijo_Json: any;
  expanded: boolean;
  descriptionsItem: string[];
  precioItem: number[];
}

export interface UploadedFile {
  file: File;
  validated: 'pending' | 'valid' | 'invalid';
  descriptionsItem: string[];
  companyName: string;
  facturaNumber: string;
  totalFactura: number;
  fechaFactura: Date;
  timefactura: string;
  precioItem: number[];
  expanded: boolean;
  description_Xml_Hijo_Json: any | undefined;
}

@Component({
  selector: 'app-company-invoice-list',
  templateUrl: './company-invoice-list.component.html',
  styleUrls: ['./company-invoice-list.component.css']
})
export class CompanyInvoiceListComponent implements OnInit {
  companies: Company[] = [];
  processing: boolean = false;
  files: UploadedFile[] = []; // Array para almacenar los archivos subidos
  showInvoiceInfo = false;
  totalFacturado: number = 0;
  companiesChart: Company[] = []; // Inicializa como un array vacío

  constructor(
    private xmlProcessingService: XmlProcessingService,
    private invoiceProcessingService: InvoiceProcessingService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // Llamar a loadCompanies() aquí para cargar los datos al inicializar el componente
    // this.loadCompaniesChart();
  }

  loadCompaniesChart(): void {
    this.companiesChart = [...this.companies]; // Copiar el arreglo de companies a companiesChart
    console.log('xx Datos cargados en company-invoice-list.component:', this.companiesChart);
  /*
    this.companiesChart = [
      {
        registrationName: 'Empresa A',
        invoices: [
          { documentReference: 'Ref1', issueDate: new Date(), issueTime: '10:00', totalFactura: 100, description_Xml_Hijo_Json: {}, expanded: false, descriptionsItem: [], precioItem: [] }
        ],
        totalFacturado: 100,
        expanded: false
      },
      {
        registrationName: 'Empresa B',
        invoices: [
          { documentReference: 'Ref2', issueDate: new Date(), issueTime: '12:00', totalFactura: 200, description_Xml_Hijo_Json: {}, expanded: false, descriptionsItem: [], precioItem: [] }
        ],
        totalFacturado: 200,
        expanded: false
      }
      // Agrega más empresas según sea necesario
    ];
  
    console.log('Datos cargados encompany-invoice-list.component:', this.companiesChart);
  }
  */
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
    const fileList = Array.from(files); // Convertir FileList o File[] a un array

    this.showInvoiceInfo = true;
    this.totalFacturado = 0;

    for (const file of fileList) {
      try {
        const result = await this.xmlProcessingService.processFile(file);
        this.addInvoiceToCompany(result);
        this.loadCompaniesChart(); // Actualizar companiesChart después de cada archivo procesado
      } catch (error: any) {
        this.toastr.error(`Error procesando el archivo ${file.name}: ${error.message || 'Error desconocido'}`, 'Error');
      }
    }

    this.processing = false;
  }

  addInvoiceToCompany(invoiceData: any): void {
    const companyIndex = this.companies.findIndex(company => company.registrationName === invoiceData.registrationName);

    const descriptionsItem: string[] = [];
    const precioItem: number[] = [];
    this.invoiceProcessingService.extractdescriptionsItem(this.invoiceProcessingService.convertDescriptionToVariables(invoiceData.descripXmlHijoJson), descriptionsItem);
    this.invoiceProcessingService.extractprecioItem(this.invoiceProcessingService.convertDescriptionToVariables(invoiceData.descripXmlHijoJson), precioItem);

    const invoice: Invoice = {
      documentReference: invoiceData.documentReference,
      issueDate: invoiceData.issueDate,
      issueTime: invoiceData.issueTime,
      totalFactura: invoiceData.totalFactura,
      description_Xml_Hijo_Json: invoiceData.descripXmlHijoJson,
      expanded: false,
      descriptionsItem,
      precioItem
    };

    this.totalFacturado += invoice.totalFactura; // Sumar el total de la factura al totalFacturado

    if (companyIndex !== -1) {
      this.companies[companyIndex].invoices.push(invoice);
      this.companies[companyIndex].totalFacturado += invoice.totalFactura;
    } else {
      this.companies.push({
        registrationName: invoiceData.registrationName,
        invoices: [invoice],
        totalFacturado: invoice.totalFactura,
        expanded: false
      });
    }
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