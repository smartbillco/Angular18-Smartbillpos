import { ChangeDetectionStrategy, Component, ViewChild,Input } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { Producto } from '../../../../models/producto';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-producto-mov',
  templateUrl: './producto-mov.component.html',
  styleUrls: ['./producto-mov.component.css'],
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductoMovComponent {
  @ViewChild(MatAccordion) accordion!: MatAccordion;

  /**
  * Propiedad de entrada que recibe un objeto Producto del componente padre. 
  */
  @Input() element!: Producto; // [ producto-mov.component.html ]

 

  openAll(): void {
    this.accordion.openAll();
  }

  closeAll(): void {
    this.accordion.closeAll();
  }
}