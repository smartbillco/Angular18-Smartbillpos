import { Component, AfterViewInit, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { Usuario } from "../../../../models/usuario";
import { Proveedor } from "../../../../models/proveedor";
import { AuthService } from "../../../../services/auth.service";
import { ProveedoresService } from "../../../../services/proveedores.service";
import { ToastrService } from 'ngx-toastr';
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { MatDialog } from "@angular/material/dialog";
import { ProveedorAddEditComponent } from "../proveedor-add-edit/proveedor-add-edit.component";
import { Subscription } from "rxjs";
import { ChangeDetectorRef } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import * as XLSX from 'xlsx';
import { ConfirmationService } from "../../../../services/confirmation.service";
import { SearchService } from "../../../../services/search.service.ts.service";

@Component({
  selector: 'app-proveedor-list',
  templateUrl: './proveedor-list.component.html',
  styleUrls: ['./proveedor-list.component.css'],
  animations: [
    // Animación para expandir y colapsar detalles de fila en la tabla 
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ProveedorListComponent implements OnInit, AfterViewInit {
  fileProveedores: File | null = null;
  usuario!: Usuario; // Usuario actual autenticado
  tipoUsuario: any; // Tipo de usuario actual

  displayedColumns: string[] = ['nombre', 'telefono', 'acciones'];
  dataSource: MatTableDataSource<Proveedor>; // Fuente de datos para la tabla 
  expandedElement?: Proveedor | null; 
  isExpansionDetailRow = (i: number, row: any) => row.hasOwnProperty('detailRow'); 

  @ViewChild(MatPaginator) paginator!: MatPaginator; 
  @ViewChild(MatSort) sort!: MatSort; 
  private subscriptions: Subscription[] = []; 

  constructor(
    public dialog: MatDialog,
    private _proveedorService: ProveedoresService,
    private _userService: AuthService,
    private _toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private _confirmationService: ConfirmationService,
    private searchService: SearchService,


  ) {
    // Suscribe al usuario por defecto desde el servicio de autenticación 
    // Obtiene el tipo de usuario desde el almacenamiento local
    this._userService.defaultUser.subscribe((user) => (this.usuario = user));
    this.tipoUsuario = localStorage.getItem("tipoUsuario");

    this.dataSource = new MatTableDataSource();// Inicializa la fuente de datos vacía
    this.obtenerProveedores();
 }

 ngOnInit(): void {
  this.subscriptions.push(
    this.searchService.currentSearchData.subscribe((data: string) => {
      this.applyFilter(data);
    })
  );
}

  ngAfterViewInit() {
    // Asigna el paginador y el ordenador a la fuente de datos después de inicializarse la vista
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

    /**
   * Obtiene la lista completa de datos manipulados desde el servicio y actualiza la tabla
   */
    obtenerProveedores() {
      this._proveedorService.getAllProveedores().subscribe(data => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    }

  
  /**
   * Aplica un filtro al contenido de la tabla 
   * @param event Objeto del evento de entrada
   */
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }



 
 /**
   * Abre un diálogo modal para agregar o editar un objeto
   * @param element_tabla Proveedor a editar (opcional)
   */
 Modal_addEditProveedor(element_tabla?: Proveedor) {
  const dialogRef = this.dialog.open(ProveedorAddEditComponent, {
    width: '550px',
    disableClose: true,
    data: { element_tabla },
  });

  dialogRef.afterClosed().subscribe(result => {
    //alert("Dialog result: "+ result);
    //console.log(`Dialog result: ${result}`); 
    if (result) {
      this.obtenerProveedores();
    }
  });
 
}


  
  /**
   * Elimina un dato por su ID y actualiza la lista de datos después de la operación
   * @param element_tabla dato a eliminar
   */
  eliminarProveedor(element_tabla: Proveedor) {
    this._confirmationService.confirm(`¿Estás seguro que deseas eliminar al proveedor ${element_tabla.nombre} con CEDULA ${element_tabla.identificacion} ?`,'1000ms', '1500ms')
    .subscribe(confirmed => {
      if (confirmed) {

        const idSeleccionado = element_tabla.idProveedor;
        if (typeof idSeleccionado === 'number') {
          this.subscriptions.push(
            this._proveedorService.deleteProveedor(idSeleccionado).subscribe({
              next: (response: any) => {
                if (response.code === "1") {
                  this.obtenerProveedores(); // Actualiza la lista de datos después de la eliminación
                  this._toastr.success('El proveedor ha sido eliminado.', 'Listo!');
                } else {
                  this._toastr.warning('Este proveedor NO puede ser eliminado.', 'Advertencia');
                }
              },
              error: (error: HttpErrorResponse) => {
                this.handleError(error); // Maneja errores HTTP
              }
            })
          );
        } else {
          this._toastr.error('ID del proveedor no válido.', 'Error');
        }

    }
  });

  }


  /**
   * Expande o colapsa un elemento de la tabla para mostrar u ocultar detalles adicionales
   * @param element Elemento de datos que se va a expandir o colapsar
   */
  toggleRow(element: Proveedor) {
    this.expandedElement = this.expandedElement === element ? null : element;
  }

 


  /**
   * Sube un archivo de datos y maneja la respuesta del servicio
   */
  subirArchivo() {
    if (this.fileProveedores) {
      this.subscriptions.push(
        this._proveedorService.uploadFile(this.fileProveedores).subscribe({
          next: (response: any) => {
            if (response.code === "1") {
              this.obtenerProveedores(); // Actualiza la lista de datos después de subir el archivo
              this._toastr.success('Proveedores registrados de manera exitosa.', 'Listo!');
            } else if (response.code === "2") {
              this.mostrarMensajeErrorDuplicado(); // Muestra un mensaje de error si hay datos duplicados
            }
          },
          error: (error: HttpErrorResponse) => {
            if (error.status === 400) {
              this._toastr.error('Error al subir el archivo. Por favor, verifica el formato y contenido del mismo.', 'Error');
            } else {
              this.handleError(error); // Maneja errores HTTP
            }
          }
        })
      );
    } else {
      console.error("Debes seleccionar un archivo para subir.");
    }
  }

  /**
   * Exporta los datos de la tabla de datos como un archivo Excel
   */
  exportAsExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataSource.data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Proveedores');
    XLSX.writeFile(wb, 'proveedores.xlsx');
  }

    /**
   * Exporta los datos de la tabla de datos como un archivo Excel
   */
    exportAsPdf() {
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataSource.data);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Proveedores');
      XLSX.writeFile(wb, 'proveedores.xlsx');
    }

  /**
   * Maneja errores HTTP y muestra mensajes de error utilizando ToastrService
   * @param error Objeto de error HTTP
   */
  private handleError(error: HttpErrorResponse) {
    if (error.status === 401) {
      this._toastr.error('No tienes permisos para realizar esta acción.', 'Error de autorización');
    } else {
      this._toastr.error('Ocurrió un error inesperado. Por favor, intenta nuevamente más tarde.', 'Error');
    }
    console.error(error);
  }

  /**
   * Muestra un mensaje de error cuando se intenta agregar un dato que ya está registrado
   */
  private mostrarMensajeErrorDuplicado() {
    this._toastr.error('Este proveedor ya se encuentra registrado.', 'Error');
  }
}