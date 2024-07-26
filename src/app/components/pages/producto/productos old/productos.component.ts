import { Component, OnInit, ViewChild } from "@angular/core";
import { Producto } from "src/app/models/producto";
import { Insumo } from "src/app/models/insumo";
import { ProductosService } from "src/app/services/productos.service";
import { InsumosService } from "src/app/services/insumos.service";
import Swal, { SweetAlertType } from "sweetalert2";
import { CategoriaProducto } from "src/app/models/categoriaProducto";
import { CategoriasService } from "src/app/services/categorias.service";
import { Proveedor } from "src/app/models/proveedor";
import { ProveedoresService } from "src/app/services/proveedores.service";
import { UtilidadesService } from "src/app/services/utilidades.service";
import { AuthService } from "src/app/services/auth.service";
import { Usuario } from "src/app/models/usuario";
import { UnidadesMedida } from "src/app/models/unidadesMedida";
import { Router } from "@angular/router";
import { Constantes } from "src/app/comun/constantes";
import { CompraService } from "src/app/services/contabilidad/compra-producto.service";
import { Receta } from "src/app/models/receta";
import { Compras } from "src/app/models/compras";
import { NuevaCompraComponent } from "./nueva-compra/nueva-compra.component";
import { saveAs } from "file-saver";
import { MovimientoInventario } from "src/app/models/movimiento-inventario";
import { InventarioService } from "src/app/services/inventario.service";
import { NgForm } from "@angular/forms";
import * as XLSX from "xlsx";
import * as moment from "moment";
import * as jsPDF from "jspdf";
import "jspdf-autotable";
import { VarGloblas } from "../../comun/global";

declare var $: any;

@Component({
  selector: "app-productos",
  templateUrl: "./productos.component.html",
  styleUrls: ["./producto.components.scss"],
})
export class ProductosComponent implements OnInit {
  @ViewChild(NuevaCompraComponent) nuevaCompraComponent: NuevaCompraComponent;

  producto: Producto;
  productoActualizar: any;
  productoEliminar: Producto;
  categoria: CategoriaProducto;
  productoDetalle: Producto;
  proveedor: Proveedor;
  fileProductos: File;
  usuario: Usuario;

  listaProductos: Array<Producto>;
  listaProductosTodos: Array<Producto>;

  listaTiposProducto: any;
  listaTiposNegocio: any;
  listaCategoria: Array<CategoriaProducto>;
  listaProveedores: Array<Proveedor>;
  listaUnidadesMedida: Array<UnidadesMedida>;
  listaInsumos: Array<Insumo>;
  listaInsumosProducto: Array<Insumo>;
  isActive: Boolean;
  nombreArchivo: string;
  compra: Compras;
  tipoUsuario: any;

  public imagePath;
  imgURL: any;
  public imgMessage: string;
  public activeAddPurchase: boolean = false;
  public activeAddInvoice: boolean = false;

  receta: Receta;
  insumoProducto: Insumo;

  movimientoinventario: MovimientoInventario;
  listTipoMovimiento: any;
  listConceptos: any;

  constructor(
    private router: Router,
    private comProductoServices: ProductosService,
    private comInsumoServices: InsumosService,
    private comCategoriaServices: CategoriasService,
    private comProveedorServices: ProveedoresService,
    private comUtilidadesServices: UtilidadesService,
    private userService: AuthService,
    private compraService: CompraService,
    private inventarioService: InventarioService
  ) {}

  ngOnInit() {
    this.producto = new Producto();
    this.producto.listRecetas = new Array<Receta>();
    this.categoria = new CategoriaProducto();
    this.proveedor = new Proveedor();
    this.productoActualizar = new Producto();
    this.productoDetalle = new Producto();
    this.listaInsumos = new Array<Insumo>();
    this.listaInsumosProducto = new Array<Insumo>();
    this.listaTiposProducto = Constantes.TIPOS_PRODUCTOS;
    this.listaTiposNegocio = Constantes.TIPOS_NEGOCIO;
    this.tipoUsuario = localStorage.getItem("tipoUsuario");
    this.receta = new Receta();
    this.insumoProducto = new Insumo();
    this.producto.idUnidadMedida = 1;

    this.getProducts("1");

    const respCat = this.comCategoriaServices.getListaCategoria();
    respCat.subscribe((response: any) => {
      this.listaCategoria = response;
      if (this.listaCategoria.length > 0) {
        this.producto.idCategoria = this.listaCategoria[0].idCategoriaProducto;
      }
    });

    const respProv = this.comProveedorServices.getListarProveedores();
    respProv.subscribe((response: any) => {
      this.listaProveedores = response;
      this.nuevaCompraComponent.listaProveedores = this.listaProveedores;
      if (this.listaProveedores.length > 0) {
        this.producto.idProveedor = this.listaProveedores[0].idProveedor;
      }
    });

    const respUtil = this.comUtilidadesServices.getUnidadesMedida();
    respUtil.subscribe((response: any) => {
      this.listaUnidadesMedida = response.msg;
    });

    const respInsumosDis = this.comInsumoServices.getInsumosDisponibles();
    respInsumosDis.subscribe((response: any) => {
      this.listaInsumos = response.msg;
    });

    this.userService.defaultUser.subscribe((user) => (this.usuario = user));
    this.compra = new Compras();
    this.movimientoinventario = new MovimientoInventario();
    this.listTipoMovimiento = Constantes.TIPO_MOVIMIENTO;
    this.listConceptos = Constantes.CONCEPTO_ENTRADA;
  }

  getProducts(value: string) {
    this.comProductoServices.getListarProductos().subscribe((data: any) => {
      $(document).ready(function () {
        $("#dt-producto").DataTable({
          language: VarGloblas.dtOptions.language,
        });
      });
      this.listaProductos = data;
      this.listaProductosTodos = this.listaProductos;
      this.nuevaCompraComponent.listaProductos = this.listaProductos;
      console.log(this.listaProductosTodos);
      this.saveAllProdutos();
    });
  }

  saveAllProdutos() {
    const resp = this.comProductoServices.getListarProductos();
    resp.subscribe((response: any) => {
      localStorage.setItem("productos", JSON.stringify(response.msg));
    });
  }

  crearProducto(formProductos: NgForm) {
    this.producto.idEmpresa = Number(localStorage.getItem("idEmpresa"));
    if (
      this.producto.tipoNegocio === 1 &&
      this.producto.listRecetas.length < 1
    ) {
      Swal("Error!", "Debe registrar mínimo un insumo a la receta.", "error");
    } else {
      if (this.validarPrecios(this.producto)) {
        $("#modal-producto").modal("hide");

        this.comProductoServices.nuevoProducto(this.producto).subscribe(
          (data: any) => {
            // const respuesta = JSON.parse(data.toString())
            const respuesta = data;

            if (respuesta.code === "1") {
              // debe mostrar un success sweet alert
              this.reloadPage("/home/productos");
              Swal("Listo!", respuesta.msg, "success");
            } else if (respuesta.code === "2") {
              this.showDuplicateErrorMessage();
              this.producto = new Producto();
            }
            // this.producto = new Producto();
          },
          (error) => Constantes.handleError(error)
        );
      } else {
        this.mostrarSweetAlert(
          "Error",
          "El precio de venta  debe ser mayor al precio de compra y al precio mínimo de venta.",
          "error"
        );
      }
    }
  }

  addInsumo() {
    //    this.receta.Insumo = insumo;
    if (this.checkDetalle(this.receta.idInsumo)) {
      // si el insumo NO existe en lista
      this.producto.listRecetas.push(this.receta);
      this.receta = new Receta();
      this.insumoProducto = null;
    } else {
      this.producto.listRecetas.find(
        (deta) => deta.idInsumo === this.receta.idInsumo
      ).cantidad = this.receta.cantidad;
      // const insumoOriginal = this.listaInsumos.find(deta => deta.id === insumo.id);
      // if(det.cantidad < insumoOriginal.cantidad){         //check cantidad inventario
      //  det.cantidad = this.receta.cantidad;
      // }
    }
  }

  borrarInsumo(det: Receta) {
    const index = this.producto.listRecetas.indexOf(det);
    this.producto.listRecetas.splice(index, 1);
  }

  checkDetalle(idProd: number): boolean {
    const det = this.producto.listRecetas.find(
      (deta) => deta.idInsumo === idProd
    );
    return det === undefined || det === null;
  }

  eliminarProducto(prod: Producto) {
    Swal({
      title: "¿Deseas eliminar este Producto?",
      // text: 'Esto no se puede revertir',
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si",
    }).then((result) => {
      if (result.value) {
        this.comProductoServices.eliminarProducto(prod).subscribe(
          (response: any) => {
            // let respuesta = JSON.parse(response.toString());
            const respuesta = response;

            if (respuesta.code === "1") {
              Swal(
                "Operacion exitosa!",
                "El producto ha sido eliminado.",
                "success"
              );
              this.reloadPage("home/productos");
            } else if (respuesta.code === "3") {
              Swal("Error", "Este producto no puede ser eliminado.", "error");
            }
          },
          (error) => Constantes.handleError(error)
        );
      }
    });
  }

  editarProducto() {
    if (this.validarPrecios(this.productoActualizar)) {
      this.comProductoServices
        .actualizarProducto(this.productoActualizar)
        .subscribe((response: boolean) => {
          if (response === true) {
            Swal("Listo!", "El producto ha sido actualizado.", "success");
            this.reloadPage("/home/productos");
          }
        });
    } else {
      this.mostrarSweetAlert(
        "Error",
        "El precio de venta debe ser mayor al precio de compra",
        "error"
      );
    }
    $("#modal-editarproducto").modal("hide");
  }

  setActualizarProducto(prod: Producto) {
    this.productoActualizar = prod;
    delete this.productoActualizar.entity;
  }

  /*consultarProductos() {
    const resp = this.comProductoServices.getListarProductos();
    resp.subscribe((response) => {
      this.listaProductos = JSON.parse(response.toString()).msg;
    }, error => Constantes.handleError(error));

  }*/

  onFileAdded(files: FileList) {
    this.fileProductos = files[0];
    this.nombreArchivo = this.fileProductos.name;
  }

  subirArchivo() {
    if (this.fileProductos != null) {
      const resp = this.comProductoServices
        .subirArchivo(this.fileProductos)
        .subscribe(
          (response: any) => {
            // console.log(response);
            // let respuesta = JSON.parse(response.toString());
            const respuesta = response;

            if (respuesta.code === "1") {
              // this.consultarProductos();
              this.reloadPage("/productos");

              Swal(
                "Listo!",
                "Productos registrados de manera exitosa.",
                "success"
              );
            } else if (respuesta.code === "2") {
              this.showDuplicateErrorMessage();
            } else if (respuesta.code === "0") {
              Swal("Error!", respuesta.msg, "error");
            }
          },
          (error) => Constantes.handleError(error)
        );
    } else {
      console.log("error debes subir archivo");
    }
  }

  filtrarPorCategoria(cate: CategoriaProducto) {
    cate.isActive = !cate.isActive;
    this.listaProductos = this.listaProductosTodos;
    this.listaProductos = this.listaProductos.filter(
      (pro) => pro.categoria === cate.nombre
    );
  }

  private showDuplicateErrorMessage() {
    Swal("Error!", "Este producto ya se encuentra registrado.", "error");
  }

  private mostrarSweetAlert(
    titulo: string,
    body: string,
    tipo: SweetAlertType
  ) {
    Swal(titulo, body, tipo);
  }

  validarPrecios(p: Producto): boolean {
    return p.precio > p.costo || p.precio > p.precioMinimo;
  }

  reloadPage(url: string) {
    this.router
      .navigateByUrl("/", { skipLocationChange: true })
      .then(() => this.router.navigate([url]));
  }

  cerrarModalEditar() {
    $("#modal-editarproducto").hide();
    this.productoActualizar = new Producto();
  }

  verDetalles(prod: Producto) {
    this.productoDetalle = prod;
    $("#modal-detalleproducto").modal("show");
  }

  getColorStock(inventario: number) {
    return Constantes.getColorInventario(inventario);
  }

  preview(files) {
    console.log(files);
    if (files.length === 0) {
      return;
    }

    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.imgMessage = "Only images are supported.";
      return;
    }

    const reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    const imgFile: File = files[0];
    reader.onload = (_event) => {
      this.imgURL = reader.result;
      this.producto.foto = this.imgURL;
      console.log(this.imgURL);
    };
  }

  previewEditProducto(files) {
    if (files.length === 0) {
      return;
    }

    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.imgMessage = "Only images are supported.";
      return;
    }

    const reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    const imgFile: File = files[0];
    reader.onload = (_event) => {
      this.imgURL = reader.result;
      this.productoActualizar.foto = this.imgURL;
    };
  }

  validateImageSize() {}

  setMedida() {
    this.compra.medida = this.listaUnidadesMedida.find(
      (m) => m.id === this.compra.idUnidadMedida
    ).nombre;
  }

  setInsumoReceta() {
    this.receta.Insumo = this.insumoProducto.nombre;
    this.receta.idInsumo = this.insumoProducto.id;
  }

  setIsFacturaProveedor(flagIsFP: boolean) {
    // console.log(typeof(flagIsFP))
    this.nuevaCompraComponent.setIsFacturaProveedor(flagIsFP);
    $("#modal-registrar-factura-proveedor").modal("show");
  }

  setConceptos() {
    if (this.movimientoinventario.tipo === 0) {
      this.listConceptos = Constantes.CONCEPTO_ENTRADA;
    } else {
      this.listConceptos = Constantes.CONCEPTO_SALIDA;
    }
  }

  setProductoMovimiento(prod: Producto) {
    this.movimientoinventario.idProducto = prod.idProducto;
  }

  nuevoMovimiento() {
    this.movimientoinventario.idEmpleado = Number(
      localStorage.getItem("idEmpleado")
    );
    // console.log(this.movimientoinventario)
    this.inventarioService
      .nuevoMovimientoProd(this.movimientoinventario)
      .subscribe(
        (response: any) => {
          // response = JSON.parse(response.toString());
          response = response;
          if (response.code === "1") {
            Swal("Listo!", response.msg, "success");
            $("#modal-agregarMovimiento").modal("hide");

            Constantes.reloadPage("/home/productos", this.router);
          } else {
            Swal("Error", response.msg, "error");
          }
        },
        (error) => Constantes.handleError(error)
      );
  }

  openIngresarProductoModal() {
    if (this.listaCategoria && !this.listaCategoria.length) {
      this.mostrarSweetAlert(
        "Error",
        "Debe agregar al menos una categoría.",
        "error"
      );
      return;
    }
    if (this.listaProveedores && !this.listaProveedores.length) {
      this.mostrarSweetAlert(
        "Error",
        "Debe agregar al menos un proveedor..",
        "error"
      );
      return;
    }
    $("#modal-producto").modal("show");
  }

  public exportProductListToExcel(): void {
    const payload: any[] = [];
    payload.push([
      "Código",
      "Código de barra",
      "Nombre",
      "Descripción",
      "Categoria",
      "Unidad de medida",
      "Inventario",
      "Inventario minimo",
      "Inventario maximo",
      "Precio de compra",
      "Precio de venta",
      "Precio minimo",
    ]);

    for (const producto of this.listaProductosTodos) {
      const newElement = [
        producto.codigo,
        producto.codigoBarra,
        producto.nombre,
        producto.descripcion,
        producto.categoria,
        producto.unidadMedida,
        producto.inventario,
        producto.minStock,
        producto.maxStock,
        producto.precio,
        producto.costo,
        producto.precioMinimo,
      ];
      payload.push(newElement);
    }
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(payload);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Hoja 1");
    XLSX.writeFile(
      wb,
      `Lista producto  ${moment(new Date()).format("DD-MM-YYYY HH:MM ")}.xlsx`
    );
  }

  exportProductListToPdf() {
    const doc = new jsPDF();
    const col = [
      "CODIGO",
      "COD DE BARRAS",
      "NOMBRE",
      "CATEGORIA",
      "U. DE MEDIDA",
      "INVENTARIO",
      "PRECIO COMPRA",
      "PRECIO VENTA",
    ];
    const rows = [];
    /* The following array of object as response from the API req  */
    const itemNew = this.listaProductosTodos;
    itemNew.forEach((element) => {
      const temp = [
        element.codigo,
        element.codigoBarra,
        element.nombre,
        element.categoria,
        element.unidadMedida,
        element.inventario,
        element.costo,
        element.precio,
      ];
      rows.push(temp);
    });

    doc.autoTable(col, rows);
    doc.save(
      `Lista productos${moment(new Date()).format("DD-MM-YYYY HH:MM")}.pdf`
    );
  }
}
