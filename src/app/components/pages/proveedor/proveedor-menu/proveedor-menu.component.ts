import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-proveedor-menu',
  templateUrl: './proveedor-menu.component.html',
  styleUrls: ['./proveedor-menu.component.css']
})
export class ProveedorMenuComponent {
  //comunicacion para la funcion que proviene de componentes padres
  @Output() addProduct   = new EventEmitter<void>(); // producto-add-edit.component.ts
  @Output() exportExcel  = new EventEmitter<void>(); // producto-list.component.ts
  @Output() exportPdf    = new EventEmitter<void>(); // producto-list.component.ts
  @Output() SubirArchivo = new EventEmitter<void>();

  constructor(private router: Router) {}

  onAddProduct() {
    this.addProduct.emit();
  }

  exportAsExcel() {
    this.exportExcel.emit();
  }

  exportAsPdf() {
    this.exportPdf.emit();
  }

  subirAsArchivo() {
    this.SubirArchivo.emit();
  }

  navigate(route: string) {
    this.router.navigateByUrl(route);
  }
}