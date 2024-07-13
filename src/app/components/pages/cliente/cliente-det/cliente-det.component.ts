import { Component, Input } from '@angular/core';
import { Cliente } from '../../../../models/cliente';

@Component({
  selector: 'app-cliente-det',
  templateUrl: './cliente-det.component.html',
  styleUrls: ['./cliente-det.component.css']
})
export class ClienteDetComponent {
  @Input() element!: Cliente;
}