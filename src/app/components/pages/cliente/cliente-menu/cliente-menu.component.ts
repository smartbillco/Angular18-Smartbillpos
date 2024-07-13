import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cliente-menu',
  templateUrl: './cliente-menu.component.html',
  styleUrls: ['./cliente-menu.component.css']
})
export class ClienteMenuComponent {
  //comunicacion para la funcion que proviene de componentes padres
  @Output() addCliente   = new EventEmitter<void>(); // cliente-list.component.ts
  @Output() exportExcel  = new EventEmitter<void>(); // cliente-list.component.ts
  @Output() exportPdf    = new EventEmitter<void>(); // cliente-list.component.ts
  @Output() SubirArchivo = new EventEmitter<void>();

  constructor(private router: Router) {}

  onAddCliente() {
    this.addCliente.emit();
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