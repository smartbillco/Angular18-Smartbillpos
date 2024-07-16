import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ScriptLoaderService } from '../../../services/utilidad/script-loader.service';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent {
  constructor(
    public dialog: MatDialog,
    private scriptLoader: ScriptLoaderService
  ) {}

  ngOnInit() {
    this.loadAssets();
  }

  loadAssets() {
    const assets: { type: 'script' | 'style', url: string }[] = [
      { type: 'style', url: 'assets/vendor/bootstrap/css/bootstrap.min.css' },
      { type: 'style', url: 'assets/vendor/bootstrap-icons/bootstrap-icons.css' },
      { type: 'style', url: 'assets/vendor/boxicons/css/boxicons.min.css' },
      { type: 'style', url: 'assets/vendor/glightbox/css/glightbox.min.css' },
      { type: 'style', url: 'assets/vendor/remixicon/remixicon.css' },
      { type: 'style', url: 'assets/vendor/swiper/swiper-bundle.min.css' },
      { type: 'style', url: 'assets/css/style.css' },
      { type: 'script', url: 'assets/vendor/aos/aos.js' },
      { type: 'script', url: 'assets/vendor/bootstrap/js/bootstrap.bundle.min.js' },
      { type: 'script', url: 'assets/vendor/glightbox/js/glightbox.min.js' },
      { type: 'script', url: 'assets/vendor/isotope-layout/isotope.pkgd.min.js' },
      { type: 'script', url: 'assets/vendor/php-email-form/validate.js' },
      { type: 'script', url: 'assets/vendor/swiper/swiper-bundle.min.js' },
      { type: 'script', url: 'assets/vendor/waypoints/noframework.waypoints.js' },
      { type: 'script', url: 'assets/js/main.js' },
    ];
    this.scriptLoader.loadAssets(assets);
  }

  openRendicionFinanciera(): void {
 
    const hostname = window.location.hostname;
    let baseUrl = '';

    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      // Entorno local
      baseUrl = `${window.location.origin}/#/rendiciones`;
    } else {
      // Entorno de producción
      const currentUrl = window.location.href;
      const basePath = currentUrl.substring(0, currentUrl.lastIndexOf('/') + 1);
      baseUrl = `${basePath}#/rendiciones`;
    }

    console.log('Opening URL:', baseUrl);
    window.open(baseUrl, '_blank');

  }


}