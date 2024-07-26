import { Injectable } from '@angular/core';
import * as moment from 'moment-timezone';
import { Company, Invoice } from '../components/pages/rendiciones/file-upload-invoice/file-upload-invoice.component';  // Ajusta la ruta según tu estructura

@Injectable({
  providedIn: 'root'
})
export class FilterInvoiceService {

  constructor() { }

  // Aplica filtros a la lista de compañías
  applyFilter(companies: Company[], filter: { name?: string; startDate?: Date; endDate?: Date }): Company[] {
    const startDate = filter.startDate ? moment.tz(filter.startDate, 'America/Bogota').toDate() : null;
    const endDate = filter.endDate ? moment.tz(filter.endDate, 'America/Bogota').toDate() : null;

    if (endDate) {
      endDate.setHours(23, 59, 59, 999);
    }

    return companies.filter(company => {
      const filteredInvoices = company.invoices.filter(invoice => 
        this.isDateInRange(new Date(invoice.issueDate), startDate, endDate)
      );

      const matchesDate = filteredInvoices.length > 0;
      const matchesName = !filter.name || company.registrationName.toLowerCase().includes(filter.name.toLowerCase());

      if (matchesName && matchesDate) {
        company.invoices = filteredInvoices;
        company.totalFacturado = filteredInvoices.reduce((acc, invoice) => 
          acc + invoice.totalFactura, 0);

        return true;
      }

      return false;
    });
  }

  // Verifica si una fecha está dentro de un rango específico
  private isDateInRange(date: Date, startDate: Date | null, endDate: Date | null): boolean {
    if (isNaN(date.getTime())) return false;
    const isAfterStartDate = startDate ? date >= startDate : true;
    const isBeforeEndDate = endDate ? date <= endDate : true;
    return isAfterStartDate && isBeforeEndDate;
  }
}
