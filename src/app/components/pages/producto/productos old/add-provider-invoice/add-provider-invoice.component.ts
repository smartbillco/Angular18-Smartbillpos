import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Compra } from '../../../models/contabilidad/compra';
import { FacturaProveedor } from '../../../models/contabilidad/factura-proveedor';
import { Producto } from 'src/app/models/producto';
import { Constantes } from 'src/app/comun/constantes';
import { FacturasProveedorService } from 'src/app/services/contabilidad/facturas-proveedor.service';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-add-provider-invoice',
  templateUrl: './add-provider-invoice.component.html',
  styleUrls: ['./add-provider-invoice.component.scss']
})
export class AddProviderInvoiceComponent implements OnInit, OnChanges {

  @Input() listaProductos: Producto[];
  @Input() listaProveedores: any;
  @Input() where: string;

  public compra: Compra = new Compra();
  public facturaProveedor: FacturaProveedor = new FacturaProveedor();
  public inventarioAnterior: number = 0;
  public inventarioNuevo: number = 0;
  public isFacturaProveedor: boolean;

  constructor(
    public facturaProveedorService: FacturasProveedorService,
    public _router: Router,
  ) {
    this.facturaProveedor.listaCompras = new Array<Compra>();
  }

  ngOnInit() {
  }

  ngOnChanges() {
  }

  nuevaCompra() {
    this.facturaProveedor.idEmpleado = Number(localStorage.getItem('idEmpleado'));
    this.facturaProveedor.idEmpresa = Number(Constantes.getIdEmpresa());
    const fechaInicio = new Date(this.facturaProveedor.fecha);
    const fechaVen = new Date(this.facturaProveedor.fechaVencimiento);
    if (fechaVen > fechaInicio) { this.facturaProveedor.estado = 'PENDIENTE'; } else { this.facturaProveedor.estado = 'PAGADO'; }

    this.facturaProveedorService.guardarFactura(this.facturaProveedor).subscribe((response) => {

      response = response;
      if (response.code === '1') {
        $('#modal-registrar-factura-proveedor').modal('hide');
        swal('Operacion exitosa!', 'Se ha realizaso el registro de factura de manera exitosa.', 'success');
        Constantes.reloadPage(this.where, this._router);
      } else {
        swal('Error!', response.msg, 'error');
      }
    }, error => {
      Constantes.handleError(error);
    });

  }

  eliminarProductoCompra(compra: any) {
    const item = this.facturaProveedor.listaCompras.indexOf(compra);
    if (item !== -1) {
      this.facturaProveedor.listaCompras.splice(item, 1);
    }
  }

  setProductoCompra() {
    const prod: Producto = this.listaProductos.find(p => p.idProducto === this.compra.idProducto);

    this.compra.idProducto = prod.idProducto;
    this.compra.producto = prod.nombre;
    this.inventarioAnterior = prod.inventario;

  }

  addProductoFactura() {
    this.facturaProveedor.listaCompras.push(this.compra);
    this.compra = new Compra();
  }

  setIsFacturaProveedor(isFP: boolean) {
    this.isFacturaProveedor = isFP;
  }



}
