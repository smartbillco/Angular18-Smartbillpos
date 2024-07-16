import { Injectable } from '@angular/core';
import { XmlProcessingService } from '../../services/rendicion/xml-processing.service';
import { InvoiceProcessingService } from '../../services/rendicion/invoice-processing.service';
import { ToastrService } from 'ngx-toastr';
import { Company, Invoice, UploadedFile } from '../../components/pages/rendiciones/company-invoice-list/company-invoice-list.component';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(
    private xmlProcessingService: XmlProcessingService,
    private invoiceProcessingService: InvoiceProcessingService,
    private toastr: ToastrService
  ) {}

  async processFiles(files: FileList | File[], companies: Company[], totalFacturado: number): Promise<{ companies: Company[], totalFacturado: number }> {
    const fileList = Array.from(files); // Convertir FileList o File[] a un array
    let updatedCompanies = [...companies];
    let updatedTotalFacturado = totalFacturado;

    for (const file of fileList) {
      try {
        const result = await this.xmlProcessingService.processFile(file);
        const { companies: newCompanies, totalFacturado: newTotalFacturado } = this.addInvoiceToCompany(result, updatedCompanies, updatedTotalFacturado);
        updatedCompanies = newCompanies;
        updatedTotalFacturado = newTotalFacturado;
      } catch (error: any) {
        this.toastr.error(`Error procesando el archivo ${file.name}: ${error.message || 'Error desconocido'}`, 'Error');
      }
    }

    return { companies: updatedCompanies, totalFacturado: updatedTotalFacturado };
  }

  addInvoiceToCompany(invoiceData: any, companies: Company[], totalFacturado: number): { companies: Company[], totalFacturado: number } {
    const updatedCompanies = [...companies];
    let updatedTotalFacturado = totalFacturado;
    const companyIndex = updatedCompanies.findIndex(company => company.registrationName === invoiceData.registrationName);

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
      descriptionsItem,
      precioItem,
      expanded: false
    };

    updatedTotalFacturado += invoice.totalFactura;

    if (companyIndex !== -1) {
      updatedCompanies[companyIndex].invoices.push(invoice);
      updatedCompanies[companyIndex].totalFacturado += invoice.totalFactura;
    } else {
      updatedCompanies.push({
        registrationName: invoiceData.registrationName,
        invoices: [invoice],
        totalFacturado: invoice.totalFactura,
        expanded: false
      });
    }

    return { companies: updatedCompanies, totalFacturado: updatedTotalFacturado };
  }
}