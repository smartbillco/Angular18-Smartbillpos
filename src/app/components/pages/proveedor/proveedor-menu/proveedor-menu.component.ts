import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-proveedor-menu',
  templateUrl: './proveedor-menu.component.html',
  styleUrls: ['./proveedor-menu.component.css']
})
export class ProveedorMenuComponent {
  @Output() addOrEditProveedor = new EventEmitter<void>(); // Emite al abrir el modal para añadir o editar un proveedor
  @Output() exportProveedoresToExcel = new EventEmitter<void>(); // Emite para exportar datos de proveedores a un archivo Excel
  @Output() exportProveedoresToPdf = new EventEmitter<void>(); // Emite para exportar datos de proveedores a un archivo PDF
  @Output() uploadProveedorFile = new EventEmitter<void>(); // Emite para iniciar la subida de un archivo de proveedores

  constructor(private router: Router) {}

  onAddOrEditProveedor() {
    this.addOrEditProveedor.emit(); // Llama al evento para añadir o editar un proveedor
  }

  ExportProveedoresToExcelFile() {
    this.exportProveedoresToExcel.emit(); // Llama al evento para exportar proveedores a Excel
  }

  ExportProveedoresToPdfFile() {
    this.exportProveedoresToPdf.emit(); // Llama al evento para exportar proveedores a PDF
  }

  initiateFileUploadProveedores() {
    this.uploadProveedorFile.emit(); // Llama al evento para subir un archivo de proveedores
  }

  navigateToRoute(route: string) {
    this.router.navigateByUrl(route); // Navega a la ruta especificada
  }
}