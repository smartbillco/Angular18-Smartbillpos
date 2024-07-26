import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SearchService } from '../../../services/search.service'; // Ajusta la ruta según sea necesario
import { Router } from '@angular/router'; // Asegúrate de que Router está importado de @angular/router

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  userName: string | null = '';
  userRol: string | null = '';

  constructor(private searchService: SearchService, private router: Router) {}

  ngOnInit() {
    this.userName = localStorage.getItem('correo');
    this.userRol  = localStorage.getItem('rol');

  }

  @Input() placeholder: string = 'Buscar...';
  @Output() search = new EventEmitter<string>();

  onSearch(event: Event) {
    const searchValue = (event.target as HTMLInputElement).value;
    this.searchService.changeSearchData(searchValue);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/']);
  }
}