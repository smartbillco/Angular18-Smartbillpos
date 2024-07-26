import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-categoria-menu',
  templateUrl: './categoria-menu.component.html',
  styleUrls: ['./categoria-menu.component.css']
})
export class CategoriaMenuComponent {
  //comunicacion para la funcion que proviene de componentes padres
  @Output() addOrEditCategory     = new EventEmitter<void>(); // Emite al abrir el modal para añadir o editar un producto.
  @Output() exportCategoryToExcel = new EventEmitter<void>(); // Emite para exportar datos a Excel.
  @Output() exportCategoryToPdf   = new EventEmitter<void>(); // Emite para exportar datos a PDF.
  @Output() uploadCategoryFile    = new EventEmitter<void>(); // Emite para iniciar la subida de un archivo.


  constructor(private router: Router) {}

  onAddOrEditCategory() {
    this.addOrEditCategory.emit(); // Abre el modal para añadir o editar un producto.
  }

  exportCategoryToExcelFile() {
    this.exportCategoryToExcel.emit(); // Exporta los datos a un archivo Excel.
  }

  exportCategoryToPdfFile() {
    this.exportCategoryToPdf.emit(); // Exporta los datos a un archivo PDF.
  }

  initiateFileUploadCategory() {
    this.uploadCategoryFile.emit(); // Inicia el proceso de subida de archivos.
  }

  navigate(route: string) {
    this.router.navigateByUrl(route);
  }
}