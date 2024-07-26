import { Injectable } from '@angular/core';
import { XmlProcessingService } from '../../services/rendicion/xml-processing.service';
import { InvoiceProcessingService } from '../../services/rendicion/invoice-processing.service';
import { ToastrService } from 'ngx-toastr';
import { Company, Invoice, UploadedFile } from '../../components/pages/rendiciones/file-upload-invoice/file-upload-invoice.component';
import JSZip from 'jszip';
@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(
    private xmlProcessingService: XmlProcessingService,
    private invoiceProcessingService: InvoiceProcessingService,
    private toastr: ToastrService
  ) {}

  async processFiles(files: FileList | File[], companies: Company[], totalFacturado: number): Promise<{ companies: Company[], totalFacturado: number, processedFiles: UploadedFile[] }> {
    const fileList = Array.from(files);
    const processedFiles: UploadedFile[] = [];
    let updatedCompanies = [...companies];
    let updatedTotalFacturado = totalFacturado;

    for (const file of fileList) {
      if (file.name.endsWith('.zip')) {
        try {
          const zip = await JSZip.loadAsync(file);
          const xmlFiles = await this.extractXmlFiles(zip);
          for (const xmlFile of xmlFiles) {
            const result = await this.xmlProcessingService.processFile(xmlFile);
            const { companies: newCompanies, totalFacturado: newTotalFacturado } = this.addInvoiceToCompany(result, updatedCompanies, updatedTotalFacturado);
            updatedCompanies = newCompanies;
            updatedTotalFacturado = newTotalFacturado;
            processedFiles.push({ file: xmlFile, status: 'valid' });
          }
        } catch (error: any) {
          this.handleError(file, error);
        }
      } else if (file.name.endsWith('.xml')) {
        try {
          const result = await this.xmlProcessingService.processFile(file);
          const { companies: newCompanies, totalFacturado: newTotalFacturado } = this.addInvoiceToCompany(result, updatedCompanies, updatedTotalFacturado);
          updatedCompanies = newCompanies;
          updatedTotalFacturado = newTotalFacturado;
          processedFiles.push({ file, status: 'valid' });
        } catch (error: any) {
          this.handleError(file, error);
          updatedCompanies = this.markCompanyAsInvalid(updatedCompanies, file.name);
          processedFiles.push({ file, status: 'invalid' });
        }
      } else {
        this.toastr.warning(`El archivo ${file.name} no es un archivo XML o ZIP válido`, 'Advertencia');
      }
    }

    return { companies: updatedCompanies, totalFacturado: updatedTotalFacturado, processedFiles };
  }

  private async extractXmlFiles(zip: JSZip): Promise<File[]> {
    const xmlFiles: File[] = [];
    for (const [relativePath, zipEntry] of Object.entries(zip.files)) {
      if (!zipEntry.dir && relativePath.endsWith('.xml')) {
        const xmlContent = await zipEntry.async('blob');
        xmlFiles.push(new File([xmlContent], relativePath, { type: 'application/xml' }));
      }
    }
    return xmlFiles;
  }

  addInvoiceToCompany(invoiceData: any, companies: Company[], totalFacturado: number): { companies: Company[], totalFacturado: number } {
    const updatedCompanies = [...companies];
    let updatedTotalFacturado = totalFacturado;
    const companyIndex = updatedCompanies.findIndex(company => company.registrationName === invoiceData.registrationName);
    const descriptionsItem: string[] = [];
    const precioItem: number[] = [];

    this.invoiceProcessingService.extractdescriptionsItem(this.invoiceProcessingService.convertDescriptionToVariables(invoiceData.xmlContentDescriptionJson), descriptionsItem);
    this.invoiceProcessingService.extractprecioItem(this.invoiceProcessingService.convertDescriptionToVariables(invoiceData.xmlContentDescriptionJson), precioItem);

    const invoice: Invoice = {
      documentReference: invoiceData.documentReference,
      issueDate: invoiceData.issueDate,
      issueTime: invoiceData.issueTime,
      descriptionsItem,
      precioItem,
      totalFactura: invoiceData.totalFactura,
      expanded: false,
      description_Xml_Hijo_Json: invoiceData.xmlContentDescriptionJson,
    };

    updatedTotalFacturado += invoice.totalFactura;

    if (companyIndex !== -1) {
      updatedCompanies[companyIndex].invoices.push(invoice);
      updatedCompanies[companyIndex].totalFacturado += invoice.totalFactura;
    } else {
      updatedCompanies.push({
        expanded: false,
        validated: 'valid',
        id: invoiceData.id,
        registrationName: invoiceData.registrationName,
        totalFacturado: invoice.totalFactura,
        invoices: [invoice]
      });
    }

    return { companies: updatedCompanies, totalFacturado: updatedTotalFacturado };
  }

  private handleError(file: File, error: any): void {
    this.toastr.error(`Error procesando el archivo ${file.name}: ${error.message || 'Error desconocido'}`, 'Error');
  }

  private markCompanyAsInvalid(companies: Company[], registrationName: string): Company[] {
    const updatedCompanies = companies.map(company => {
      if (company.registrationName === registrationName) {
        return { ...company, validated: 'invalid' as 'invalid' };
      }
      return company;
    });

    const companyExists = updatedCompanies.some(company => company.registrationName === registrationName);
    if (!companyExists) {
      updatedCompanies.push({
        expanded: false,
        validated: 'invalid' as 'invalid',
        id: `invalid-${Date.now()}`,
        registrationName: registrationName,
        totalFacturado: 0,
        invoices: []
      });
    }

    return updatedCompanies;
  }
}