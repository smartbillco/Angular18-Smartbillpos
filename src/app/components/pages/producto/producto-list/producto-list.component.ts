// producto-list.component.ts
import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, Output, EventEmitter } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { Usuario } from "../../../../models/usuario";
import { Producto } from "../../../../models/producto";
import { AuthService } from "../../../../services/auth.service";
import { ProductosService } from "../../../../services/productos.service";
import { ToastrService } from 'ngx-toastr';
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { MatDialog } from "@angular/material/dialog";
import { ProductoAddEditComponent } from "../producto-add-edit/producto-add-edit.component";
import { Subscription } from "rxjs";
import { ChangeDetectorRef } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import * as XLSX from 'xlsx';
import { ConfirmationService } from "../../../../services/confirmation.service";
import { SearchService } from '../../../../services/search.service.ts.service';

@Component({
  selector: 'app-producto-list',
  templateUrl: './producto-list.component.html',
  styleUrls: ['./producto-list.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ProductoListComponent implements OnInit, AfterViewInit, OnDestroy {
  fileProductoes: File | null = null;
  usuario!: Usuario;
  tipoUsuario: any;
  displayedColumns: string[] = ['foto', 'nombre', 'inventario', 'acciones'];
  dataSource: MatTableDataSource<Producto>;
  expandedElement?: Producto | null;
  isExpansionDetailRow = (i: number, row: any) => row.hasOwnProperty('detailRow');

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  private subscriptions: Subscription[] = [];

  //se definen un EventEmitter para que el componente padre 
  //(producto-menu.component.ts) pueda suscribirse a él y ejecutar las funciones.

  @Output() addProduct  = new EventEmitter<void>();
  @Output() exportExcel  = new EventEmitter<void>();
  @Output() exportPdf    = new EventEmitter<void>();
  @Output() SubirArchivo = new EventEmitter<void>();

  

  constructor(
    public dialog: MatDialog,
    private _ProductoService: ProductosService,
    private _userService: AuthService,
    private _toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private _confirmationService: ConfirmationService,
    private searchService: SearchService
  ) {
    this._userService.defaultUser.subscribe((user) => (this.usuario = user));
    this.tipoUsuario = localStorage.getItem("tipoUsuario");

    this.dataSource = new MatTableDataSource();
    this.obtenerProductos();
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.searchService.currentSearchData.subscribe((data: string) => {
        this.applyFilter(data);
      })
    );
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  toggleRow(element: Producto) {
    this.expandedElement = this.expandedElement === element ? null : element;
  }

  Modal_addEditProducto(element_tabla?: Producto) {
    const dialogRef = this.dialog.open(ProductoAddEditComponent, {
      width: '550px',
      disableClose: true,
      data: { element_tabla },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.obtenerProductos();
      }
    });
  }

  obtenerProductos() {
    this.subscriptions.push(
      this._ProductoService.getAllProductos().subscribe({
        next: (data) => {
          this.dataSource.data = data;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.cdr.detectChanges();
        },
        error: (error: HttpErrorResponse) => {
          this.handleError(error);
        }
      })
    );
  }

  eliminarProducto(producto: Producto) {
    this._confirmationService.confirm(`¿Estás seguro que deseas eliminar al Producto ${producto.nombre} con CEDULA ${producto.idProducto} ?`, '1000ms', '1500ms')
      .subscribe(confirmed => {
        if (confirmed) {
          this.subscriptions.push(
            this._ProductoService.deleteProducto(producto).subscribe({
              next: (response: any) => {
                if (response.id === producto.idProducto) {
                  this.obtenerProductos();
                  this._toastr.success('El Producto ha sido eliminado correctamente.', 'Eliminación Exitosa');
                } else {
                  this._toastr.warning('Este Producto NO puede ser eliminado.', 'Advertencia');
                }
              },
              error: (error: HttpErrorResponse) => {
                this.handleError(error);
              }
            })
          );
        }
      });
  }

  subirArchivo() {
    if (this.fileProductoes) {
      this.subscriptions.push(
        this._ProductoService.uploadFile(this.fileProductoes).subscribe({
          next: (response: any) => {
            if (response.code === "1") {
              this.obtenerProductos();
              this._toastr.success('Productos registrados de manera exitosa.', 'Listo!');
            } else if (response.code === "2") {
              this.mostrarMensajeErrorDuplicado();
            }
          },
          error: (error: HttpErrorResponse) => {
            if (error.status === 400) {
              this._toastr.error('Error al subir el archivo. Por favor, verifica el formato y contenido del mismo.', 'Error');
            } else {
              this.handleError(error);
            }
          }
        })
      );
    } else {
      console.error("Debes seleccionar un archivo para subir.");
    }
  }



   // Agregar estas funciones para escuchar los eventos emitidos




  
  exportAsExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataSource.data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Productos');
    XLSX.writeFile(wb, 'Productos.xlsx');
  }

  exportAsPdf() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataSource.data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Productos');
    XLSX.writeFile(wb, 'Productos.xlsx');
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 401) {
      this._toastr.error('No tienes permisos para realizar esta acción.', 'Error de autorización');
    } else {
      this._toastr.error('Ocurrió un error inesperado. Por favor, intenta nuevamente más tarde.', 'Error');
    }
    console.error(error);
  }

  private mostrarMensajeErrorDuplicado() {
    this._toastr.error('Este Producto ya se encuentra registrado.', 'Error');
  }
}