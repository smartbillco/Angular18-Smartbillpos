import { Component, AfterViewInit, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { Usuario } from "../../../../models/usuario";
import { Cliente } from "../../../../models/cliente";
import { AuthService } from "../../../../services/auth.service";
import { ClientesService } from "../../../../services/clientes.service";
import { ToastrService } from 'ngx-toastr';
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { MatDialog } from "@angular/material/dialog";
import { ClienteAddEditComponent } from "../cliente-add-edit/cliente-add-edit.component";
import { Subscription } from "rxjs";
import { ChangeDetectorRef } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import * as XLSX from 'xlsx';
import { ConfirmationService } from "../../../../services/confirmation.service";
import { SearchService } from "../../../../services/search.service.ts.service";

@Component({
  selector: 'app-cliente-list',
  templateUrl: './cliente-list.component.html',
  styleUrls: ['./cliente-list.component.css'],
  animations: [
    // Animación para expandir y colapsar detalles de fila en la tabla 
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ClienteListComponent implements OnInit, AfterViewInit, OnDestroy {
  fileclientees: File | null = null;
  usuario!: Usuario; // Usuario actual autenticado
  tipoUsuario: any; // Tipo de usuario actual

  displayedColumns: string[] = ['nombre', 'celular', 'acciones'];
  dataSource: MatTableDataSource<Cliente>; // Fuente de datos para la tabla 
  expandedElement?: Cliente | null; 
  isExpansionDetailRow = (i: number, row: any) => row.hasOwnProperty('detailRow'); 

  @ViewChild(MatPaginator) paginator!: MatPaginator; 
  @ViewChild(MatSort) sort!: MatSort; 
  private subscriptions: Subscription[] = []; 

  constructor(
    public dialog: MatDialog,
    private _clienteService: ClientesService,
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

    this.dataSource = new MatTableDataSource(), // Inicializa la fuente de datos vacía
    this.obtenerClientes(); // Obtiene y muestra los datos al inicializar el componente
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

  ngOnDestroy(): void {
    // Cancela todas las suscripciones al destruir el componente para evitar fugas de memoria
    this.subscriptions.forEach(sub => sub.unsubscribe());
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
   * Expande o colapsa un elemento de la tabla para mostrar u ocultar detalles adicionales
   * @param element Elemento de datos que se va a expandir o colapsar
   */
  toggleRow(element: Cliente) {
    this.expandedElement = this.expandedElement === element ? null : element;
  }

  /**
   * Abre un diálogo modal para agregar o editar un objeto
   * @param element_tabla cliente a editar (opcional)
   */
  Modal_addEditCliente(element_tabla?: Cliente) {
    const dialogRef = this.dialog.open(ClienteAddEditComponent, {
      width: '550px',
      disableClose: true,
      data: { element_tabla },
    });

    dialogRef.afterClosed().subscribe(result => {
      //alert(`Prueba Propiedad afterClosed: ${result}`) 
      if (result) {//objetivo, si le das click en cancelar no se refresca los datos
        this.obtenerClientes();
      }
    });
  }

  /**
   * Obtiene la lista completa de datos manipulados desde el servicio y actualiza la tabla
   */
  obtenerClientes() {
    this.subscriptions.push(
      this._clienteService.getAllClientes().subscribe({
        next: (data) => {

       // Convertir el objeto 'cliente' a una cadena JSON
       // const clienteJson = JSON.stringify(data);
        // Mostrar el JSON en un alert
        //alert(clienteJson);

          this.dataSource.data = data; // Asigna los datos obtenidos al origen de datos de la tabla
          this.dataSource.paginator = this.paginator; // Configura el paginador
          this.dataSource.sort = this.sort; // Configura el ordenador
          this.cdr.detectChanges(); // Detecta cambios después de actualizar la vista
        },
        error: (error: HttpErrorResponse) => {
          this.handleError(error); // Maneja errores HTTP
        }
      })
    );
  }

  /**
   * Elimina un dato por su ID y actualiza la lista de datos después de la operación
   * @param element_tabla dato a eliminar
   */
  eliminarCliente(cliente: Cliente) {
    this._confirmationService.confirm(`¿Estás seguro que deseas eliminar al cliente ${cliente.nombre} con CEDULA ${cliente.identificacion} ?`,'1000ms', '1500ms')
      .subscribe(confirmed => {
        if (confirmed) {
          this.subscriptions.push(
            this._clienteService.deleteCliente(cliente).subscribe({
              next: (response: any) => {
                if (response.id === cliente.id) {
                  this.obtenerClientes(); // Actualiza la lista de clientes después de la eliminación
                  this._toastr.success('El cliente ha sido eliminado correctamente.', 'Eliminación Exitosa');
                } else {
                  this._toastr.warning('Este cliente NO puede ser eliminado.', 'Advertencia');
                }
              },
              error: (error: HttpErrorResponse) => {
                this.handleError(error); // Maneja errores HTTP
              }
            })
          );
        }
      });
  }

  /*
  eliminarCliente(cliente: Cliente) {
    const confirmacion = confirm(`¿Estás seguro que deseas eliminar al cliente ${cliente.nombre}?`);
    if (confirmacion) {
      this.subscriptions.push(
        this._clienteService.deleteCliente(cliente).subscribe({
          next: (response: any) => {

            //const clienteJson = JSON.stringify(response);
            // Mostrar el JSON en un alert
            //alert("response"+clienteJson);*/
            /*
            let respuesta = response;

            console.log(respuesta);
            if ((respuesta.code = "1")) {
              this.reloadPage("/home/clientes");
              Swal("Listo!", "El Cliente ha sido eliminado.", "success");
       ¿     }*/
/*
            if (response.id  === cliente.id) {
              this.obtenerClientes(); // Actualiza la lista de clientes después de la eliminación
              this._toastr.success('El cliente ha sido eliminado correctamente.', 'Eliminación Exitosa');
            } else {
              this._toastr.warning('Este cliente NO puede ser eliminado.', 'Advertencia');
            }
          },
          error: (error: HttpErrorResponse) => {
            this.handleError(error); // Maneja errores HTTP
          }
        })
      );
    }
  }*/

  /**
   * Sube un archivo de datos y maneja la respuesta del servicio
   */
  subirArchivo() {
    if (this.fileclientees) {
      this.subscriptions.push(
        this._clienteService.uploadFile(this.fileclientees).subscribe({
          next: (response: any) => {
            if (response.code === "1") {
              this.obtenerClientes(); // Actualiza la lista de datos después de subir el archivo
              this._toastr.success('clientes registrados de manera exitosa.', 'Listo!');
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
    XLSX.utils.book_append_sheet(wb, ws, 'clientes');
    XLSX.writeFile(wb, 'clientes.xlsx');
  }

    /**
   * Exporta los datos de la tabla de datos como un archivo Excel
   */
    exportAsPdf() {
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataSource.data);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'clientes');
      XLSX.writeFile(wb, 'clientes.xlsx');
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
    this._toastr.error('Este cliente ya se encuentra registrado.', 'Error');
  }
}