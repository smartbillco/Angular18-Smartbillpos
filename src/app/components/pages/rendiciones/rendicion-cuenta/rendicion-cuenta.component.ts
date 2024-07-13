import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-rendicion-cuenta',
  templateUrl: './rendicion-cuenta.component.html',
  styleUrls: ['./rendicion-cuenta.component.css']
})
export class RendicionCuentaComponent implements OnInit {

  constructor(private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle('Rendición de Cuentas - SmartBill'); // Cambia el título dinámicamente
  }

}