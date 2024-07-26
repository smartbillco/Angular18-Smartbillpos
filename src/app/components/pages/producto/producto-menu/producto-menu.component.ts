import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Componente de menú para gestionar productos.
 */
@Component({
  selector: 'app-producto-menu',
  templateUrl: './producto-menu.component.html',
  styleUrls: ['./producto-menu.component.css']
})
export class ProductoMenuComponent {
  @Output() addOrEditProduct      = new EventEmitter<void>(); // Emite al abrir el modal para añadir o editar un producto.
  @Output() exportProductsToExcel = new EventEmitter<void>(); // Emite para exportar datos a Excel.
  @Output() exportProductsToPdf   = new EventEmitter<void>(); // Emite para exportar datos a PDF.
  @Output() uploadProductFile     = new EventEmitter<void>(); // Emite para iniciar la subida de un archivo.

  constructor(private router: Router) {}

  onAddOrEditProduct() {
    this.addOrEditProduct.emit(); // Abre el modal para añadir o editar un producto.
  }

  exportProductsToExcelFile() {
    this.exportProductsToExcel.emit(); // Exporta los datos a un archivo Excel.
  }

  exportProductsToPdfFile() {
    this.exportProductsToPdf.emit(); // Exporta los datos a un archivo PDF.
  }

  initiateFileUploadProducts() {
    this.uploadProductFile.emit(); // Inicia el proceso de subida de archivos.
  }

  navigateToRoute(route: string) {
    this.router.navigateByUrl(route); // Navega a la ruta especificada.
  }
}