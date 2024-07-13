import { Component, Input } from '@angular/core';
import { Producto } from '../../../../models/producto';

@Component({
  selector: 'app-producto-det',
  templateUrl: './producto-det.component.html',
  styleUrls: ['./producto-det.component.css']
})
export class ProductoDetComponent {

   /**
   * Propiedad de entrada que recibe un objeto Producto del componente padre. 
   */
  @Input() element!: Producto; // [ producto-list.component.html ]

}