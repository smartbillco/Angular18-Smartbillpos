import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { XmlProcessingService } from '../../../../services/xml-processing.service';
import { InvoiceProcessingService } from '../../../../services/invoice-processing.service';
import { Data } from '@angular/router';

// Definición de la interfaz para los archivos cargados
interface UploadedFile {
  file: File;
  validated?: 'pending' | 'valid' | 'invalid';
  xmlContent?: string;
  expanded?: boolean;
  
  description_Xml_Hijo_Json?: any; 

  companyName?: string;
  facturaNumber?: string;
  fechaFactura?: Data;
  timefactura?: string;
  totalFactura: number;

  descriptionsItem: string[]; // Propiedad para almacenar descripciones del archivo
  precioItem: number[];    // array de precios
}

@Component({
  selector: 'app-file-upload-modal',
  templateUrl: './file-upload-modal.component.html',
  styleUrls: ['./file-upload-modal.component.css']
})
export class FileUploadModalComponent {
  files: UploadedFile[] = [];  // Array que contiene los archivos cargados
  totalFacturado: number = 0;

  processing: boolean = false;
  showInvoiceInfo = false;

  constructor(
    private toastr: ToastrService,               // Servicio Toastr para notificaciones
    private xmlProcessingService: XmlProcessingService,  // Servicio para procesamiento XML
    private invoiceProcessingService: InvoiceProcessingService,

  ) {}

  // Manejar la selección de archivos desde input
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      Array.from(input.files).forEach(file => {
        // Inicializar las propiedades requeridas de UploadedFile
        const uploadedFile: UploadedFile = {
          file,
          validated: 'pending',
          descriptionsItem: [],
          companyName: '',
          facturaNumber: '',
          fechaFactura: new Date(),
          timefactura: '',
          totalFactura: 0,
          precioItem: [],
          expanded: false,
          description_Xml_Hijo_Json: undefined,
        };

        this.files.push(uploadedFile);
      });
    }
  }

  // Procesar archivos cargados
  async onProcess(): Promise<void> {
    this.processing = true;
    this.showInvoiceInfo = true;
    this.totalFacturado = 0;

    const pendingFiles = this.files.filter(file => file.validated === 'pending');

    for (const file of pendingFiles) {
      file.descriptionsItem = []; // Inicializar descripciones para el archivo actual
      file.precioItem = []; // Inicializar montos de extensiones de línea para el archivo actual

      try {
        await this.delay(150);
        const result = await this.xmlProcessingService.processFile(file.file);

        file.companyName = result.registrationName;
        file.facturaNumber = result.documentReference;
        file.totalFactura = result.totalFactura;
        file.validated = 'valid';
        file.xmlContent = result.xmlContent;
        file.description_Xml_Hijo_Json = result.descripXmlHijoJson;

        // Extraer descripciones y precios de ítems usando InvoiceProcessingService
        this.invoiceProcessingService.extractdescriptionsItem(
          this.invoiceProcessingService.convertDescriptionToVariables(file.description_Xml_Hijo_Json),
          file.descriptionsItem
        );

        this.invoiceProcessingService.extractprecioItem(
          this.invoiceProcessingService.convertDescriptionToVariables(file.description_Xml_Hijo_Json),
          file.precioItem
        );

        if (file.validated === 'valid') {
          this.totalFacturado += file.totalFactura;
        }

      } catch (error: any) {
        console.error('Error processing file:', error);
        this.toastr.error(`Error processing file ${file.file.name}: ${error.message || 'Unknown error'}`, 'Error');
        file.validated = 'invalid';
        // Agregar logging adicional a la consola para registrar el error
        console.error(`Error processing file ${file.file.name}:`, error);
      }
    }

    this.processing = false;
  }

  // Manejar evento de arrastrar sobre área de drop
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const element = event.target as HTMLElement;
    element.classList.add('dragover');
  }

  // Manejar evento de salir del área de drop
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const element = event.target as HTMLElement;
    element.classList.remove('dragover');
  }

 // Manejar evento de soltar archivos en área de drop
onDrop(event: DragEvent): void {
  event.preventDefault();
  event.stopPropagation();
  const element = event.target as HTMLElement;
  element.classList.remove('dragover');

  if (event.dataTransfer) {
    Array.from(event.dataTransfer.files).forEach(file => {
      // Inicializar las propiedades requeridas de UploadedFile
      const uploadedFile: UploadedFile = {
        file,
        validated: 'pending',
        descriptionsItem: [], 
        
        companyName: '',   
        facturaNumber: '', 
        totalFactura: 0,
        fechaFactura: new Date(),
        timefactura: '',
        precioItem: [], 

        expanded: false, 

        description_Xml_Hijo_Json: undefined, 
      };

      this.files.push(uploadedFile);
    });
  }
}


  // Función para introducir un retraso
  delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Alternar expansión del panel de archivo
  togglePanel(file: UploadedFile): void {
    file.expanded = !file.expanded;
  }

  // Obtener nombre del archivo
  getFileName(file: UploadedFile): string {
    return file.companyName || file.file.name;
  }

  // Obtener numero factura
  getFileFactura(file: UploadedFile): string {
    return file.facturaNumber || file.file.name;
  }

  // Obtener clase de estado del archivo
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

  // Obtener etiqueta de estado del archivo
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




  // Limpiar lista de archivos
  clearFileList(): void {
    this.files = [];
    this.totalFacturado = 0;
  }

  // Abrir el archivo PDF asociado al XML
  openPdf(file: UploadedFile): void {
    const pdfFileName = file.file.name.replace('.xml', '.pdf');
    const pdfFilePath = `path/to/pdf/files/${pdfFileName}`;
    window.open(pdfFilePath, '_blank');
  }
}