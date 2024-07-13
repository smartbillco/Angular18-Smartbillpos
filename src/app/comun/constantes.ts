import { Injectable } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";

import { ToastrService } from 'ngx-toastr';
import { throwError } from "rxjs";

@Injectable()
export class Constantes {
  // public static HOST = 'http://www.smartbill.us:8086';
  // public static HOST = "http://localhost:8080";
  public static HOST = "https://www.smartbill.com.co/pos-0.0.1";

  // SMARTBILL REMOTO
  public static CONSULTAR_USUARIO_SMARTBILL =
    "http://www.smartbill.us:8080/Smartbillpos/api/usuario/getUserByDocument/";
  public static POST_FACTURA_SMARTBILLCORE =
    "http://www.smartbill.us:8080/Smartbillpos/api/factura/nuevaFacturaPOS/";

  // CATEGORIAS
  public static GET_CATEGORIAS = "/webservice/categorias/getAll";
  public static POST_CATEGORIAS = "/webservice/categorias/nuevaCategoria";
  public static POST_ACTUALIZAR_CATEGORIAS =
    "/webservice/categorias/actualizar";
  public static POST_ARCHIVO_CATEGORIAS = "/webservice/categorias/nuevoLista";
  public static DELETE_CATEGORIAS = "/webservice/categorias/delete";

  // PROVEEDORES
  public static GET_PROVEEDORES = "/webservice/proveedores/getAll";
  public static POST_PROVEEDORES = "/webservice/proveedores/nuevoProveedor";
  public static POST_ACTUALIZAR_PROVEEDORES =
    "/webservice/proveedores/actualizar";
  public static POST_ARCHIVO_PROVEEDORES = "/webservice/proveedores/nuevoLista";
  public static DELETE_PROVEEDORES = "/webservice/proveedores/delete";
  public static GET_REPORTE_PROVEEDORES = "/webservice/proveedores/getReporte";
  public static GET_PROVIDER_INVOICES =
    "/webservice/facturas-proveedor/consultarEnRangoFechas";
  public static GET_PROVIDER_INVOICE_BY_ID_PROVIDER =
    "/webservice/facturas-proveedor/consultarPorProveedor";

  // PRODUCTOS
  public static GET_PRODUCTOS_TODOS = "/webservice/productos/getAll";
  public static GET_PRODUCTOS = "/webservice/productos/tipoNegocio";
  // public static GET_RECETAS = '/webservice/productos/tipoNegocio'
  public static GET_PRODUCTOS_DISPONIBLES =
    "/webservice/productos/getDisponibles";
  public static POST_PRODUCTOS = "/webservice/productos/nuevoProducto";
  public static POST_ACTUALIZAR_PRODUCTOS = "/webservice/productos/actualizar";
  public static POST_ARCHIVO_PRODUCTOS = "/webservice/productos/nuevoLista/";
  public static DELETE_PRODUCTOS = "/webservice/productos/delete";
  public static PEDIR_RECETAS = "1";
  public static PEDIR_PRODUCTOS = "0";

  // INSUMOS
  public static GET_INSUMOS = "/webservice/insumos/getAll";
  public static GET_INSUMOS_DISPONIBLES = "/webservice/insumos/getDisponibles";
  public static GET_REPORTE_INSUMOS =
    "/webservice/inventario/insumos/getReporteInventario/";
  public static POST_INSUMOS = "/webservice/insumos/nuevoInsumo";
  public static POST_ACTUALIZAR_INSUMOS = "/webservice/insumos/actualizar";
  public static POST_ARCHIVO_INSUMOS = "/webservice/insumos/nuevoLista/";
  public static DELETE_INSUMOS = "/webservice/insumos/delete";

  // RESTAURANTE
  public static POST_RESTAURANTE = "/webservice/restaurante/nuevoRestaurante";
  public static PUT_RESTAURANTE =
    "/webservice/restaurante/actualizarRestaurante";
  public static DELETE_RESTAURANTE =
    "/webservice/restaurante/deleteRestaurante/";
  public static GET_RESTAURANTES =
    "/webservice/restaurante/getAllRestaurantes/";
  public static POST_ZONA = "/webservice/restaurante/nuevaZona";
  public static PUT_ZONA = "/webservice/restaurante/actualizarZona";
  public static DELETE_ZONA = "/webservice/restaurante/deleteZona/";
  public static GET_ZONAS = "/webservice/restaurante/getAllZonas/";

  public static POST_MESA = "/webservice/restaurante/nuevaMesa";
  public static POST_ASIGNAR_MESA = "/webservice/restaurante/asignarMesa/";
  public static GET_MESAS = "/webservice/restaurante/getAllMesas/";
  public static PUT_MESA = "/webservice/restaurante/actualizarMesa";
  public static GET_MESAS_POR_ZONA =
    "/webservice/restaurante/getAllMesasByZona/";
  public static DELETE_MESA = "/webservice/restaurante/deleteMesa/";

  // ORDEN  MESA
  public static GET_NUMERO_ORDEN_MESA =
    "/webservice/facturas/getNumeroOrdenMesa/";
  public static GET_DETALLE_MESA = "/webservice/facturas/getDetallesOrdenMesa/";
  public static POST_ACTUALIZAR_DETALLES_MESA =
    "/webservice/facturas/detalles/insertar";
  public static POST_CERRAR_MESA = "/webservice/restaurante/cerrarMesa/";

  // RESERVA DE MESAS
  public static POST_RESERVA = "/webservice/restaurante/reservas/nuevaReserva";
  public static PUT_RESERVA =
    "/webservice/restaurante/reservas/actualizarReserva";
  public static GET_RESERVAS_MESA =
    "/webservice/restaurante/reservas/getReservasMesa/";
  public static GET_RESERVAS_CLIENTE =
    "/webservice/restaurante/reservas/getReservasCliente/";
  public static GET_RESERVAS_RESTAURANTE =
    "/webservice/restaurante/reservas/getReservasRestaurante/";

  // CAJA
  public static POST_CONCEPTO_CAJA = "/webservice/caja/nuevoConcepto";
  public static POST_MOVIMIENTO_CAJA = "/webservice/caja/nuevoMovimiento";
  public static POST_REPORTE_MOVIMIENTOS_CAJA =
    "/webservice/caja/getReporteMovimientos";
  public static GET_MOVIMIENTOS_CAJA_BY_FECHA =
    "/webservice/caja/getMovimientosByFecha/";
  public static GET_CAJA_INFO = "/webservice/caja/getCaja/";
  public static GET_CONCEPTOS_CAJA = "/webservice/caja/getConceptos/";
  public static GET_ALL_CASH_REGISTERS = "/webservice/caja/";
  public static POST_INSERT_CASH_REGISTER = "/webservice/caja/insertar";
  public static GET_ALL_CASH_REGISTER = "/webservice/caja";
  public static OPNE_CASH_REGISTER = "/webservice/cicloCaja/abrirCaja";
  public static CLOSE_CASH_REGISTER = "/webservice/cicloCaja/cerrarCaja";
  public static GET_CASH_REGISTER_BY_ID = "/webservice/caja/findOne";

  // INVENTARIO PRODUCTOS
  public static POST_MOVIMIENTO_INV_PROD =
    "/webservice/inventario/nuevoMovimiento";
  public static GET_MOV_INV_PROD_ALL_MES =
    "/webservice/inventario/productos/getMovMes/";
  public static getAllMovements =
    "/webservice/inventario/productos/getAllMovimientos/0/0000-00-00/0000-00-00";

  public static GET_MOV_INV_PROD_FECHA =
    "/webservice/inventario/productos/getMovProdFecha/";
  public static GET_MOV_INV_PROD_MES =
    "/webservice/inventario/productos/getMovProdMes/";
  public static GET_REPORTE_INV_PROD =
    "/webservice/inventario/productos/getReporteInventario/";

  // PERMISOS
  public static GET_PERMISOS = "/webservice/seguridad/getAllPermisos/";
  public static GET_PERMISOS_ACTIVOS =
    "/webservice/seguridad/getAllPermisosActivos/";
  public static GET_PERMISOS_ROL = "/webservice/seguridad/getPermisosRol/";
  public static POST_PERMISO_ROL = "/webservice/seguridad/asignarPermisoRol";
  public static PUT_PERMISO = "/webservice/seguridad/actualizarPermiso/";

  // ROLES
  public static GET_ROLES = "/webservice/seguridad/getAllRoles/";
  public static GET_ROLES_ACTIVOS = "/webservice/seguridad/getAllRolesActivos/";
  public static POST_ROL = "/webservice/seguridad/nuevoRol";
  public static POST_ROL_USUARIO = "/webservice/seguridad/asignarRolUsuario/";
  public static DELETE_ROL = "/webservice/seguridad/deleteRol/";
  public static PUT_ROL = "/webservice/seguridad/actualizarRol";

  // CLIENTES
  public static POST_CLIENTES = "/webservice/clientes/nuevoCliente";
  public static GET_CLIENTES = "/webservice/clientes/getAll";
  public static POST_ACTUALIZAR_CLIENTES = "/webservice/clientes/actualizar";
  public static DELETE_CLIENTES = "/webservice/clientes/delete";
  public static GET_CLIENTE_BY_DOCUMENT = "/webservice/clientes/getByDocument";
  public static POST_ARCHIVO_CLIENTES = "/webservice/clientes/nuevoLista";
  public static GET_REPORTE_CLIENTES = "/webservice/clientes/getReporte";

  // FACTURAS
  public static GET_FACTURAS_BY_DATE = "/webservice/facturas/getFacturasByDate";
  public static GET_FACTURA_BY_NUMERO =
    "/webservice/facturas/getFacturasByNumero";
  public static GET_FACTURAS_BY_ID = "/webservice/facturas/getDetallesFactura/";
  public static POST_FACTURAS = "/webservice/facturas/insertar";
  public static POST_FACTURAS_REPORTE = "/webservice/facturas/getReporteExcel";
  public static POST_FACTURA_PRINT = "/webservice/facturas/reImprimirFactura/";
  public static POST_INVOICES_BY_IMPLICIT_DATE =
    "/webservice/facturas/consultarFacturasPorRangoFechas";
  public static GET_INVOICES_BY_CUTOMER_ID =
    "/webservice/facturas/consultarFacturasPorCliente";
  public static GET_getVoidedInvocies =
    "/webservice/facturas/consultarFacturasAnuladasPorRangoFechas";
  public static GET_DiscountedInvoices =
    "/webservice/facturas/consultarFacturasConDescuentoPorRangoFechas";

  // FACTURAS PROVEEDORES
  public static GET_FACTURAS_PROVEEDOR_BY_MES =
    "/webservice/facturas-proveedor/getFacturasByMes/";
  public static GET_ABONOS_CP_BY_FACTURA =
    "/webservice/facturas-proveedor/getAbonos/";
  public static GET_DETALLES_FACTURAS_PROVEEDOR =
    "/webservice/facturas-proveedor/getProductosFacturaProveedor/";
  public static GET_REPORTE_FACTURAS_PROVEEDOR =
    "/webservice/facturas-proveedor//";
  public static POST_FACTURAS_PROVEEDOR =
    "/webservice/facturas-proveedor/nuevaFactura";
  public static POST_ABONOS_CP = "/webservice/facturas-proveedor/nuevoAbono";
  public static GET_UNPAID_INVOICES = "/webservice/productos/getAll/1";
  public static getInvoicesByImplicitDate =
    "/webservice/facturas-proveedor/consultarEnRangoFechas";

  // USUARIOS
  public static GET_USUARIOS_BY_COMPANY =
    "/webservice/user/getUsuariosByCompany/";
  public static POST_USUARIOS_REGISTRAR = "/webservice/user/addUser";
  public static PUT_USUARIOS_ACTUALIZAR = "/webservice/user/getAll";
  public static DELETE_USUARIO = "/webservice/user/getAll";
  public static POST_ACTUALIZAR_PASSWORD = "/webservice/user/reset-password";
  public static POST_UPDATE_USER = "/webservice/user/editUser";

  // CUENTAS POR COBRAR
  public static GET_CC_BY_MES = "/webservice/cuentas-cobro/getByCCMes/";
  public static POST_ABONO_CC = "/webservice/cuentas-cobro/nuevoAbonoCC";
  public static GET_ABONOS_CC = "/webservice/cuentas-cobro/getAbonosCC/";
  public static GET_CUENTAS_COBRAR_POR_FECHA =
    "/webservice/facturas/cuentas/porCobrar";
  public static GET_CUENTAS_COBRAR_POR_CLIENTE =
    "/webservice/facturas/cuentas/porCobrar/cliente";

  // EMPLEADOS
  public static GET_EMPLEADOS = "/webservice/empleados/getAll/";
  public static POST_EMPLEADOS = "/webservice/empleados/nuevo";
  // public static POST_ROL_USUARIO = '/webservice/empleados/asignarRolUsuario/';
  public static DELETE_EMPLEADO = "/webservice/empleados/delete/";
  public static PUT_EMPLEADO = "/webservice/empleados/actualizar";
  public static GET_REPORTE_EMPLEADOS = "/webservice/empleados/getReporte/";

  // GASTOS
  public static POST_GASTOS_REGISTRAR = "/webservice/gastos/nuevoGasto";
  public static GET_GASTOS_BY_MONTH = "/webservice/gastos/getByMes/";

  // LIQUIDACIONES
  public static POST_LIQUIDACIONES_REGISTRAR =
    "/webservice/liquidaciones/nuevaLiquidacion";
  public static GET_LIQUIDACIONES_BY_MONTH =
    "/webservice/liquidaciones/getByMes/";
  public static GET_LIQUIDACIONES_BY_MONTH_AND_USER =
    "/webservice/liquidaciones/getByMesAndUser/";

  // INGRESOS
  public static POST_INGRESOS_REGISTRAR = "/webservice/ingresos/nuevoIngreso";
  public static GET_INGRESOS_BY_MONTH = "/webservice/ingresos/getByMes/";

  // EMPRESA
  public static GET_INFO_EMPRESA = "/webservice/empresas/getInfoEmpresa/";
  public static PUT_EMPRESA = "/webservice/empresas/actualizar";

  // COMPRA PRODUCTOS
  public static GET_COMPRAS_BY_MES = "/webservice/comprasProducto/getByMonth/";
  public static GET_COMPRAS_BY_PRODUCTO =
    "/webservice/comprasProducto/getByMonthAndProduct/";
  public static POST_COMPRA_NUEVA = "/webservice/comprasProducto/nuevaCompra";

  // REPORTES
  public static GET_REPORTES = "/webservice/facturas/getReportes/";
  public static GET_REPORTES_ANIO = "/webservice/facturas/getReportesAnio/";
  public static GET_REPORTES_FECHAS = "/webservice/facturas/getReportesFechas/";

  public static CORREO_ENVIADO =
    "A su correo electrónico fue enviada la información con su nueva contraseña";
  public static CORREO_NO_EXISTE = "Ese correo no existe en sistema";

  // BUSQUEDAS
  public static GET_CUSTOMER = "/webservice/clientes/buscarPorCedulaCelular/";

  // SMARTBILL LOCAL
  // public static CONSULTAR_USUARIO_SMARTBILL = 'http://localhost:8084/SmartBillCoreRS/api/usuario/getUserByDocument/';
  // public static POST_FACTURA_SMARTBILLCORE = 'http://localhost:8084/SmartBillCoreRS/api/factura/nuevaFacturaPOS/';

  public static ESTADOS: any = [
    { nombre: "ACTIVO", valor: 1 },
    { nombre: "INACTIVO", valor: 0 },
  ];

  public static TIPOS_NEGOCIO: any = [
    { nombre: "RESTAURANTE", valor: 1 },
    { nombre: "OTROS", valor: 0 },
  ];

  public static ROLES_USUARIOS: any = [
    { nombre: "ADMINISTRADOR", valor: 1 },
    { nombre: "CAJERO", valor: 2 },
    { nombre: "MESERO", valor: 3 },
    { nombre: "SUPERVISOR", valor: 4 },
  ];
  public static TIPOS_PRODUCTOS: any = [
    { nombre: "PRODUCTO", valor: 0 },
    { nombre: "INSUMO", valor: 1 },
  ];

  public static TIPO_MOVIMIENTO: any = [
    { nombre: "ENTRADA", valor: 0 },
    { nombre: "SALIDA", valor: 1 },
  ];

  public static CONCEPTO_ENTRADA: any = [
    "CONTEO",
    "SALDOS INICIALES",
    "AJUSTE",
    "OTRO",
  ];

  public static CONCEPTO_SALIDA: any = [
    "CONSUMO",
    "DEVOLUCIÓN",
    "AJUSTE",
    "OTRO",
  ];

  public static TIPOS_DOCUMENTO: Array<string> = ["CC", "TI", "NIT", "RUT"];

  public static MOTIVOS_SALIDA_INVENTARIO: Array<string> = [
    "SALIDA POR DEVOLUCIÓN",
    "SALIDA POR CONSUMO",
    "SALIDA POR AJUSTE",
    "OTROS",
  ];

  public static MOTIVOS_ENTRADA_INVENTARIO: Array<string> = [
    "ENTRADA POR COMPRA",
    "ENTRADA POR AJUSTE",
    "ENTRADA POR CONTEO",
    "ENTRADA POR SALDOS INICIALES",
    "OTRO",
  ];

  public static TIPOS_REGIMEN: Array<string> = [
    "RÉGIMEN COMÚN",
    "RÉGIMEN SIMPLIFICADO",
    "OTRO",
  ];

  public static MOTIVOS_CAMBIO_PRECIO: Array<string> = ["OFERTA", "PROMOCIÓN"];

  public static TIPO_DE_GASTOS: any = [
    { nombre: "GASTOS ADMINISTRATIVOS", valor: 1 },
    { nombre: "COMPRA DE INSUMOS", valor: 2 },
    { nombre: "PAGO DE SERVICIOS A TERCEROS", valor: 3 },
    { nombre: "OTROS", valor: 4 },
  ];

  public static TIPO_DE_INGRESOS: any = ["ABONO A CUENTA POR COBRAR", "OTROS"];

  public static MESES: any = [
    { nombre: "ENERO", valor: 1 },
    { nombre: "FEBRERO", valor: 2 },
    { nombre: "MARZO", valor: 3 },
    { nombre: "ABRIL", valor: 4 },
    { nombre: "MAYO", valor: 5 },
    { nombre: "JUNIO", valor: 6 },
    { nombre: "JULIO", valor: 7 },
    { nombre: "AGOSTO", valor: 8 },
    { nombre: "SEPTIEMBRE", valor: 9 },
    { nombre: "OCTUBRE", valor: 10 },
    { nombre: "NOVIEMBRE", valor: 11 },
    { nombre: "DICIEMBRE", valor: 12 },
  ];
  //  public static HOST = 'http://www.smartbill.us:8089';
  // public static HOST = 'http://localhost:8086';
  // public static REMOTE_SERVER = '';

  public LOGIN = "/";

  public static getColorInventario(inventario: number) {
    if (inventario < 20) {
      return "badge-danger";
    } else if (inventario >= 20 && inventario < 50) {
      return "badge-warning";
    } else if (inventario >= 50 && inventario < 100) {
      return "badge-success";
    } else {
      return "badge-primary"; // Asegúrate de tener un return aquí para cubrir todos los casos
    }
  }

  public static formatDate(date: Date): string {
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    return `${year}-${month}-${day}`;
  }


  public static handleError(error: HttpErrorResponse, toastr: ToastrService) {
    toastr.error('Error', error.message);
    return throwError(() => error); // Utilizar throwError con una función que devuelve el error
  }

  public static reloadPage(url: string, router: Router) {
    router
      .navigateByUrl("/", { skipLocationChange: true })
      .then(() => router.navigate([url]));
  }

  public static getIdEmpresa() {
    return localStorage.getItem("idEmpresa");
  }

  public static setNombreMes(mes: string) {
    let nombreMes = "";

    switch (mes) {
      case "1":
        nombreMes = "ENERO";
        break;
      case "2":
        nombreMes = "FEBRERO";
        break;
      case "3":
        nombreMes = "MARZO";
        break;
      case "4":
        nombreMes = "ABRIL";
        break;
      case "5":
        nombreMes = "MAYO";
        break;
      case "6":
        nombreMes = "JUNIO";
        break;
      case "7":
        nombreMes = "JULIO";
        break;
      case "8":
        nombreMes = "AGOSTO";
        break;
      case "9":
        nombreMes = "SEPTIEMBRE";
        break;
      case "10":
        nombreMes = "OCTUBRE";
        break;
      case "11":
        nombreMes = "NOVIEMBRE";
        break;
      case "12":
        nombreMes = "DICIEMBRE";
        break;
    }
    return nombreMes;
  }
}
