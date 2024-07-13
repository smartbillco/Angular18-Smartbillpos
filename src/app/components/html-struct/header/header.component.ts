import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SearchService } from '../../../services/search.service.ts.service'; // Ajusta la ruta según sea necesario

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  //Inyectamos servicio al constructor
  constructor(private searchService: SearchService) {}

  //Parametrizamos la busqueda en header para que se comunique con los componentes
  @Input() placeholder: string = 'Buscar...';
  @Output() search = new EventEmitter<string>();
  
  onSearch(event: Event) {
    const searchValue = (event.target as HTMLInputElement).value;
    this.searchService.changeSearchData(searchValue);
  }
  //Fin parametrizacion busqueda -------------------------------------------------


}