import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FacturaProveedor } from 'src/app/models/contabilidad/factura-proveedor';
import { FacturasProveedorService } from 'src/app/services/contabilidad/facturas-proveedor.service';
import { Compra } from 'src/app/models/contabilidad/compra';
import { Producto } from 'src/app/models/producto';
import { Constantes } from 'src/app/comun/constantes';
import { Proveedor } from 'src/app/models/proveedor';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Cliente } from '../../../models/cliente';
declare var $: any;

@Component({
  selector: 'app-nueva-compra',
  templateUrl: './nueva-compra.component.html',
  styles: []
})
export class NuevaCompraComponent implements OnInit, OnChanges {

  @Input() productList: Producto[];
  @Input() providersList: any[];

  facturaProveedor: FacturaProveedor;
  listaProductos: Array<Producto>;
  listaProveedores: Array<Proveedor>;
  compra: Compra;

  inventarioAnterior: number;
  inventarioNuevo: number;

  isFacturaProveedor: boolean;

  constructor(private facturaProveedorService: FacturasProveedorService, private router: Router) {
    this.facturaProveedor = new FacturaProveedor();
    this.facturaProveedor.listaCompras = new Array<Compra>();
    this.compra = new Compra();
    this.inventarioAnterior = 0;
    this.inventarioNuevo = 0;
    this.isFacturaProveedor = true;
  }

  ngOnChanges() {
    this.listaProductos = this.productList;
    this.listaProveedores = this.providersList;
  }

  ngOnInit() {

  }

  nuevaCompra(data: any) {

    this.facturaProveedor.idEmpleado = Number(localStorage.getItem('idEmpleado'));
    this.facturaProveedor.idEmpresa = Number(Constantes.getIdEmpresa());
    const fechaInicio = new Date(this.facturaProveedor.fecha);
    const fechaVen = new Date(this.facturaProveedor.fechaVencimiento);
    if (fechaVen > fechaInicio) { this.facturaProveedor.estado = 'PENDIENTE'; } else { this.facturaProveedor.estado = 'PAGADO'; }

    this.facturaProveedorService.guardarFactura(this.facturaProveedor).subscribe((response: any) => {
      if (response.code === '1') {
        $('#modal-nueva-compra').modal('hide');
        swal('Operación exitosa', 'Se ha registrado la compra de manera correcta', 'success');
        Constantes.reloadPage('/home/productos', this.router);
      } else {
        swal('Error!', response.msg, 'error');
      }
    }, error => Constantes.handleError(error));

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

  eliminarProductoCompra() {

  }
}
