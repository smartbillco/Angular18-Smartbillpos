import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InvoiceProcessingService {

  constructor() {}

  extractdescriptionsItem(variablesArray: any[], descriptionsItemArray: string[]): void {
    try {
      variablesArray.forEach(variable => {
        if (variable.key === 'cac:Item' && variable.value['cbc:Description']) {
          const descriptionsItem = variable.value['cbc:Description'];
          if (Array.isArray(descriptionsItem)) {
            descriptionsItem.forEach((desc: any) => {
              descriptionsItemArray.push(desc._text || desc);
            });
          } else {
            descriptionsItemArray.push(descriptionsItem._text || descriptionsItem);
          }
        } else if (this.isObject(variable.value) || this.isArray(variable.value)) {
          this.extractdescriptionsItem(this.convertDescriptionToVariables(variable.value), descriptionsItemArray);
        }
      });
    } catch (error) {
      this.handleError(error, 'extractdescriptionsItem');
    }
  }

  extractprecioItem(variablesArray: any[], precioItemArray: number[]): void {
    try {
      variablesArray.forEach(variable => {
        if (variable.key === 'Invoice' && variable.value && variable.value['cac:InvoiceLine']) {
          const invoiceLines = variable.value['cac:InvoiceLine'];
          if (Array.isArray(invoiceLines)) {
            invoiceLines.forEach((invoiceLine: any) => {
              if (invoiceLine['cbc:LineExtensionAmount'] && invoiceLine['cbc:LineExtensionAmount']._text) {
                const amount = parseFloat(invoiceLine['cbc:LineExtensionAmount']._text);
                if (!isNaN(amount)) {
                  precioItemArray.push(amount);
                } else {
                  console.warn(`Valor no numérico encontrado para LineExtensionAmount: ${invoiceLine['cbc:LineExtensionAmount']._text}`);
                }
              }
            });
          } else {
            if (invoiceLines['cbc:LineExtensionAmount'] && invoiceLines['cbc:LineExtensionAmount']._text) {
              const amount = parseFloat(invoiceLines['cbc:LineExtensionAmount']._text);
              if (!isNaN(amount)) {
                precioItemArray.push(amount);
              } else {
                console.warn(`Valor no numérico encontrado para LineExtensionAmount: ${invoiceLines['cbc:LineExtensionAmount']._text}`);
              }
            }
          }
        } else if (this.isObject(variable.value) || this.isArray(variable.value)) {
          this.extractprecioItem(this.convertDescriptionToVariables(variable.value), precioItemArray);
        }
      });
    } catch (error) {
      this.handleError(error, 'extractprecioItem');
    }
  }

  private handleError(error: unknown, methodName: string): void {
    if (error instanceof Error) {
      console.error(`Error en ${methodName}: ${error.message}`);
      throw new Error(`Error en ${methodName}: ${error.message}`);
    } else {
      console.error(`Error desconocido en ${methodName}`);
      throw new Error(`Error desconocido en ${methodName}`);
    }
  }

  isObject(value: any): boolean {
    return value && typeof value === 'object' && !Array.isArray(value);
  }

  isArray(value: any): boolean {
    return Array.isArray(value);
  }

  convertDescriptionToVariables(description: any): any[] {
    return Object.keys(description).map(key => ({ key, value: description[key] }));
  }
}