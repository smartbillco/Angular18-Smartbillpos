import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResetProductosService {

  private reloadProductsSource = new Subject<void>(); // Indica que no se emite ningún valor

  reset = this.reloadProductsSource.asObservable();

  constructor() { }

  mostrarTodos() {
    this.reloadProductsSource.next(); // Emitir el evento de reset sin valor
  }
}