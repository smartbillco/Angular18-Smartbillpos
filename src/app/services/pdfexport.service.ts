import { Injectable } from '@angular/core';
import { Company } from '../components/pages/rendiciones/file-upload-invoice/file-upload-invoice.component';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

const pdfMakeInstance: any = pdfMake;
pdfMakeInstance.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root'
})
export class PdfExportService {
  constructor() { }

  exportToPdf(companies: Company[], fileName: string): void {
    const documentDefinition = this.getDocumentDefinition(companies);
    pdfMakeInstance.createPdf(documentDefinition).download(`${fileName}_${new Date().getTime()}.pdf`);
  }

  private getDocumentDefinition(companies: Company[]): any {
    const body = [];

    // Encabezado de la tabla
    body.push([
      { text: 'Company ID', bold: true },
      { text: 'Company Name', bold: true },
      { text: 'Document Reference', bold: true },
      { text: 'Issue Date', bold: true },
      { text: 'Issue Time', bold: true },
      { text: 'Descriptions Item', bold: true },
      { text: 'Price Item', bold: true }
    ]);

    // Datos de la tabla
    companies.forEach(company => {
      company.invoices.forEach(invoice => {
        invoice.descriptionsItem.forEach((description, index) => {
          body.push([
            company.id ?? '',
            company.registrationName ?? '',
            invoice.documentReference ?? '',
            invoice.issueDate ? invoice.issueDate.toISOString().split('T')[0] : '',
            invoice.issueTime ?? '',
            description ?? '',
            invoice.precioItem[index] ?? ''
          ]);
        });
      });
    });

    return {
      content: [
        {
          table: {
            headerRows: 1,
            widths: ['*', '*', '*', '*', '*', '*', '*'],
            body: body
          }
        }
      ]
    };
  }
}