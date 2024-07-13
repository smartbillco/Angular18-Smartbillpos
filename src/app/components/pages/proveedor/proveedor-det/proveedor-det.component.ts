import { Component, Input } from '@angular/core';
import { Proveedor } from '../../../../models/proveedor';

@Component({
  selector: 'app-proveedor-det',
  templateUrl: './proveedor-det.component.html',
  styleUrls: ['./proveedor-det.component.css']
})
export class ProveedorDetComponent {
  @Input() element!: Proveedor;
}