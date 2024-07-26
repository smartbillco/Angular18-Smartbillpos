import { Component, OnInit } from '@angular/core';
import { Producto } from '../../../models/producto';
import { ToastrService } from 'ngx-toastr';

import { ScriptLoaderService } from '../../../services/utilidad/script-loader.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls:  ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  listaProductos!: Producto[];

  constructor(

    private toastr: ToastrService,
    private scriptLoader: ScriptLoaderService,
  ) { }

  ngOnInit() {

    //this.loadAssets();
    
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