import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cliente-menu',
  templateUrl: './cliente-menu.component.html',
  styleUrls: ['./cliente-menu.component.css']
})
export class ClienteMenuComponent {
  //comunicacion para la funcion que proviene de componentes padres
  @Output() addOrEditCustomer      = new EventEmitter<void>(); // Emite al abrir el modal para añadir o editar un producto.
  @Output() exportCustomerToExcel = new EventEmitter<void>(); // Emite para exportar datos a Excel.
  @Output() exportCustomerToPdf   = new EventEmitter<void>(); // Emite para exportar datos a PDF.
  @Output() uploadCustomerFile     = new EventEmitter<void>(); // Emite para iniciar la subida de un archivo.


  constructor(private router: Router) {}

  onAddOrEditCustomer() {
    this.addOrEditCustomer.emit(); // Abre el modal para añadir o editar un producto.
  }

  exportCustomerToExcelFile() {
    this.exportCustomerToExcel.emit(); // Exporta los datos a un archivo Excel.
  }

  exportCustomeroPdfFile() {
    this.exportCustomerToPdf.emit(); // Exporta los datos a un archivo PDF.
  }

  initiateFileUploadCustomer() {
    this.uploadCustomerFile.emit(); // Inicia el proceso de subida de archivos.
  }
  navigate(route: string) {
    this.router.navigateByUrl(route);
  }
}