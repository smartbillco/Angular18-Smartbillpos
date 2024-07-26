import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { Company } from '../components/pages/rendiciones/file-upload-invoice/file-upload-invoice.component';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ExcelExportService {
  constructor() {}

  exportToExcel(companies: Company[], fileName: string): void {
    // Crear un arreglo de datos formateados para el archivo Excel
    const formattedData = companies.flatMap(company => 
      company.invoices.flatMap(invoice => 
        invoice.descriptionsItem.map((description, index) => ({
          'Company ID': company.id,
          'Company Name': company.registrationName,
          'Document Reference': invoice.documentReference,
          'Issue Date': invoice.issueDate.toISOString().split('T')[0],  // Formato YYYY-MM-DD
          'Issue Time': invoice.issueTime,
          'Descriptions Item': description,
          'Price Item': invoice.precioItem[index]
        }))
      )
    );

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Invoices': worksheet },
      SheetNames: ['Invoices']
    };

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    });
    this.saveAsExcelFile(excelBuffer, fileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    saveAs(data, `${fileName}_${new Date().getTime()}.xlsx`);
  }
}

const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';