import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { XmlProcessingService } from '../../../../services/xml-processing.service';

interface UploadedFile {
  file: File;
  validated?: 'pending' | 'valid' | 'invalid';
  xmlContent?: string;
  expanded?: boolean;
  companyName?: string;
  description_xml?: string;
  nestedInfo?: any; // Agregar campo para la información anidada
  uniqueIndex?: number; // Agregar índice único para contar empresas repetidas
}

@Component({
  selector: 'app-file-upload-modal',
  templateUrl: './file-upload-modal.component.html',
  styleUrls: ['./file-upload-modal.component.css']
})
export class FileUploadModalComponent {
  files: UploadedFile[] = [];
  invoices: any[] = [];
  
  processing: boolean = false;
  showInvoiceInfo = false;

  // Objeto para almacenar totales por empresa
  companyTotals: { [key: string]: number } = {};

  // Objeto para contar empresas repetidas
  companyCount: { [key: string]: number } = {};

  // Objeto para mantener un registro de empresas únicas procesadas
  uniqueCompanies: { [key: string]: boolean } = {};

  constructor(
    private toastr: ToastrService,
    private xmlProcessingService: XmlProcessingService
  ) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      Array.from(input.files).forEach(file => {
        this.files.push({ file, validated: 'pending' });
      });
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
      Array.from(event.dataTransfer.files).forEach(file => {
        this.files.push({ file, validated: 'pending' });
      });
    }
  }

  async onProcess(): Promise<void> {
    this.processing = true;
    this.showInvoiceInfo = true;
    
    this.invoices = [];

    for (const file of this.files) {
      try {
        if (file.validated === 'pending') {
          await this.delay(500);
          const result = await this.xmlProcessingService.processFile(file.file);

          file.companyName = result.registrationName;
          file.description_xml = result.description;
          file.nestedInfo = result.nestedInfo; // Guardar la información anidada
          file.validated = 'valid';
          file.xmlContent = result.xmlContent;

          // Agregar total a la empresa en el objeto companyTotals
          if (this.companyTotals[file.companyName]) {
            this.companyTotals[file.companyName] += result.nestedInfo.totalFactura;
          } else {
            this.companyTotals[file.companyName] = result.nestedInfo.totalFactura;
          }

          // Contar empresa en el objeto companyCount
          if (this.companyCount[file.companyName]) {
            this.companyCount[file.companyName]++;
          } else {
            this.companyCount[file.companyName] = 1;
          }

          // Asignar índice único para contar empresas repetidas
          if (!this.uniqueCompanies[file.companyName]) {
            this.uniqueCompanies[file.companyName] = true;
            file.uniqueIndex = this.companyCount[file.companyName];
          }

          this.invoices.push({
            companyName: result.registrationName,
            nestedInfo: result.nestedInfo, // Agregar información anidada a las facturas
          });
        }
      } catch (error: any) {
        console.error('Error processing file:', error);
        this.toastr.error(`Error processing file ${file.file.name}: ${error.message || 'Unknown error'}`, 'Error');
        file.validated = 'invalid';
      }
    }

    this.processing = false;

    // Reiniciar el estado de los archivos pendientes a inválidos
    this.files.forEach(file => {
      if (file.validated === 'pending') {
        file.validated = 'invalid';
      }
    });
  }

  delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  togglePanel(file: UploadedFile): void {
    file.expanded = !file.expanded;
  }

  getFileName(file: UploadedFile): string {
    return file.companyName || file.file.name;
  }

  getFileStatusClass(status: 'invalid' | 'valid' | 'pending' | undefined): string {
    switch (status) {
      case 'invalid':
        return 'invalid-file';
      case 'valid':
        return 'valid-file';
      case 'pending':
        return 'pending-file';
      default:
        return '';
    }
  }

  getFileStatusLabel(status: 'invalid' | 'valid' | 'pending' | undefined, file: UploadedFile): string {
    switch (status) {
      case 'invalid':
        return '✘';
      case 'valid':
        return '✔';
      case 'pending':
        return '*';
      default:
        return '';
    }
  }
}