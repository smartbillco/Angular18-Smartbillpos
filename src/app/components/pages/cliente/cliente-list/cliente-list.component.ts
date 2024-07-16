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
import { SharedModule } from '../../../../shared/shared.module'; // Ajusta la ruta según la ubicación real


@Component({
  selector: 'app-cliente-list',
  templateUrl: './cliente-list.component.html',
  styleUrls: ['./cliente-list.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ClienteListComponent implements OnInit, AfterViewInit, OnDestroy {
  fileclientees: File | null = null;
  usuario!: Usuario;
  tipoUsuario: any;

  displayedColumns: string[] = ['nombre', 'celular', 'acciones'];
  dataSource: MatTableDataSource<Cliente>;
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
    this._userService.defaultUser.subscribe((user) => (this.usuario = user));
    this.tipoUsuario = localStorage.getItem("tipoUsuario");

    this.dataSource = new MatTableDataSource();
    this.obtenerClientes();
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

  toggleRow(element: Cliente) {
    this.expandedElement = this.expandedElement === element ? null : element;
  }

  Modal_addEditCliente(element_tabla?: Cliente) {
    const dialogRef = this.dialog.open(ClienteAddEditComponent, {
      width: '550px',
      disableClose: true,
      data: { element_tabla },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.obtenerClientes();
      }
    });
  }

  obtenerClientes() {
    this.subscriptions.push(
      this._clienteService.getAllClientes().subscribe({
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

  eliminarCliente(cliente: Cliente) {
    this._confirmationService.confirm(`¿Estás seguro que deseas eliminar al cliente ${cliente.nombre} con CEDULA ${cliente.identificacion} ?`,'1000ms', '1500ms')
      .subscribe(confirmed => {
        if (confirmed) {
          this.subscriptions.push(
            this._clienteService.deleteCliente(cliente).subscribe({
              next: (response: any) => {
                if (response.id === cliente.id) {
                  this.obtenerClientes();
                  this._toastr.success('El cliente ha sido eliminado correctamente.', 'Eliminación Exitosa');
                } else {
                  this._toastr.warning('Este cliente NO puede ser eliminado.', 'Advertencia');
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
    if (this.fileclientees) {
      this.subscriptions.push(
        this._clienteService.uploadFile(this.fileclientees).subscribe({
          next: (response: any) => {
            if (response.code === "1") {
              this.obtenerClientes();
              this._toastr.success('clientes registrados de manera exitosa.', 'Listo!');
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

  exportAsExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataSource.data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'clientes');
    XLSX.writeFile(wb, 'clientes.xlsx');
  }

  exportAsPdf() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataSource.data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'clientes');
    XLSX.writeFile(wb, 'clientes.xlsx');
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
    this._toastr.error('Este cliente ya se encuentra registrado.', 'Error');
  }
}