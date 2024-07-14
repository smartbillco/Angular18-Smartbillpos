import { Component, OnInit } from '@angular/core';
import { ProductosService } from '../../../services/productos.service';
import { Producto } from '../../../models/producto';
import { ToastrService } from 'ngx-toastr';
import { Constantes } from '../../../comun/constantes';
import { CajaService } from '../../../services/caja.service';
import { ScriptLoaderService } from '../../../services/script-loader.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls:  ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  listaProductos!: Producto[];
  public idCaja: number | null = null;

  constructor(
    private _productoService: ProductosService,
    private _cashRegisterService: CajaService,
    private toastr: ToastrService,
    private scriptLoader: ScriptLoaderService,
  ) { }

  ngOnInit() {
    this.idCaja = Number(localStorage.getItem('idCaja'));
    this.consultarProductos();
    this.getMainCashRegister();
    //this.loadAssets();
    
  }

  consultarProductos() {
    this._productoService.getProductosDisponibles().subscribe((response: any) => {
      const respuesta = response;
      if (respuesta.code === '1') {
        this.listaProductos = respuesta.msg;
        localStorage.setItem('productos', JSON.stringify(this.listaProductos));
      } else {
        this.toastr.error(respuesta.msg, 'Error');
      }
    }, error => {
      Constantes.handleError(error, this.toastr);
    });
  }

  getMainCashRegister() {
    if (this.idCaja) {
      return;
    } else {
      this._cashRegisterService.getCaja().subscribe((data: any) => {
        localStorage.setItem('idCaja', data.msg.id.toString());
      });
    }
  }

  loadAssets() {
    const assets: { type: 'script' | 'style', url: string }[] = [
        { type: 'script', url: 'assets/demo/js/other-charts.js' },
        { type: 'style',  url: 'assets/scss/inc/widgets/_quick-stats.scss' },
        { type: 'script', url: 'assets/vendors/sparkline/jquery.sparkline.min.js' },
      //{ type: 'style', url:  'assets/scss/inc/bootstrap-overrides/_badges.scss' },
    ];
    this.scriptLoader.loadAssets(assets);
  }
}