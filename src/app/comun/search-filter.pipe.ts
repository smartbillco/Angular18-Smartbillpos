import { Pipe, PipeTransform } from '@angular/core';

// Define an interface representing the structure of your objects
interface Producto {
  nombre: string;
  // Add other properties as needed
}


@Pipe({ name: 'searchFilter' })
export class SearchFilterPipe implements PipeTransform {

  transform(value: Producto[], search: string): Producto[] {
    if (!search) {
      return value;
    }
    
    let solution = value.filter((v: Producto) => {
      if (!v || !v.nombre) {
        return false;
      }
      return v.nombre.toLowerCase().indexOf(search.toLowerCase()) !== -1;
    });

    return solution;
  }

}