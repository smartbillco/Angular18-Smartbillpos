// filter-invoice.component.ts
import { Component, EventEmitter, Output } from '@angular/core';

export interface Filter {
  name?: string;
  startDate?: Date;
  endDate?: Date;
}

@Component({
  selector: 'app-filter-invoice',
  templateUrl: './filter-invoice.component.html',
  styleUrls: ['./filter-invoice.component.css']
})
export class FilterInvoiceComponent {
  @Output() filterChanged = new EventEmitter<Filter>();

  companyName: string = '';
  startDate: Date | undefined;
  endDate: Date | undefined;

  applyFilter(): void {
    this.filterChanged.emit({
      name: this.companyName,
      startDate: this.startDate,
      endDate: this.endDate
    });
  }

  clearFilter(): void {
    this.companyName = '';
    this.startDate = undefined;
    this.endDate = undefined;
    this.applyFilter();
  }
}