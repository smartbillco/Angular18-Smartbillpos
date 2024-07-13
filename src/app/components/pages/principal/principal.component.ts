import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FileUploadModalComponent } from '../rendiciones/file-upload-modal/file-upload-modal.component'; // Ajusta la ruta según tu estructura de archivos
import { ScriptLoaderService } from '../../../services/script-loader.service';



@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent {
    constructor(public dialog: MatDialog,
    private scriptLoader: ScriptLoaderService

  ) {}

  ngOnInit() {
    this.loadAssets();
    
  }

  loadAssets() {
    const assets: { type: 'script' | 'style', url: string }[] = [

      // { type: 'style', url: 'assets/vendor/aos/aos.css' },
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
        //{ type: 'script', url: '' },
    ];
    this.scriptLoader.loadAssets(assets);
  }

 /*
@import '../../../../../assets/vendor/aos/aos.css';
@import '../../../../../assets/vendor/bootstrap/css/bootstrap.min.css';
@import '../../../../../assets/vendor/bootstrap-icons/bootstrap-icons.css';
@import '../../../../../assets/vendor/boxicons/css/boxicons.min.css';
@import '../../../../../assets/vendor/glightbox/css/glightbox.min.css';
@import '../../../../../assets/vendor/remixicon/remixicon.css';
@import '../../../../../assets/vendor/swiper/swiper-bundle.min.css';
@import '../../../../../assets/css/style.css';
 */
 /*
  <script src="../../../../../assets/vendor/aos/aos.js"></script>
  <script src="../../../../../assets/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
  <script src="../../../../../assets/vendor/glightbox/js/glightbox.min.js"></script>
  <script src="../../../../../assets/vendor/isotope-layout/isotope.pkgd.min.js"></script>
  <script src="../../../../../assets/vendor/php-email-form/validate.js"></script>
  <script src="../../../../../assets/vendor/swiper/swiper-bundle.min.js"></script>
  <script src="../../../../../assets/vendor/waypoints/noframework.waypoints.js"></script>

  <!-- Template Main JS File -->
  <script src="../../../../../assets/js/main.js"></script>
  */

/*
  openFileUploadModal(): void {
    const dialogRef = this.dialog.open(FileUploadModalComponent, {
      width: '800px',
      disableClose: true // Evita que se cierre al hacer clic fuera o presionar Esc

    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El modal de subida de archivos se cerró');
    });
  }*/

    openRendicionFinanciera(): void {
      window.open('/#/rendiciones', '_blank');
    }
}