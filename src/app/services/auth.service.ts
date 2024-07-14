import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, timer, Subscription } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Usuario } from '../models/usuario';
import { Constantes } from '../comun/constantes';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usuarioSource = new BehaviorSubject<Usuario>(new Usuario());
  defaultUser = this.usuarioSource.asObservable();
  private tokenExpirationTimer: Subscription = new Subscription(); // Inicialización

  private readonly inactivityTimeout = 5 * 60 * 1000; // 5 minutos en milisegundos

  constructor(private http: HttpClient, private router: Router) {
    this.initTokenExpirationTimer();
    this.initInactivityTimer();
  }

  private initTokenExpirationTimer(): void {
    // Reinicia el temporizador de cierre de sesión cada vez que el usuario interactúa con la aplicación
    this.tokenExpirationTimer = timer(0, 1000).subscribe(() => {
      if (this.isUserAuthenticated()) {
        const expirationTime = localStorage.getItem('tokenExpiration');
        if (expirationTime) {
          const now = new Date().getTime();
          const expiresIn = new Date(expirationTime).getTime() - now;
          if (expiresIn <= 0) {
            this.logout(); // Token expirado, cerrar sesión
          }
        }
      }
    });
  }

  private initInactivityTimer(): void {
    // Reinicia el temporizador de inactividad cuando el usuario interactúa con la aplicación
    let inactivityTimeoutId: any;
    const resetTimer = () => {
      clearTimeout(inactivityTimeoutId);
      inactivityTimeoutId = setTimeout(() => {
        this.logout(); // Usuario inactivo, cerrar sesión
      }, this.inactivityTimeout);
    };

    // Escuchar eventos de interacción
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('click', resetTimer);
  }

  login(usuario: Usuario): Observable<any> {
    const pathLogin = '/webservice/user/login';
    const httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(Constantes.HOST + pathLogin, usuario, { headers: httpHeaders })
      .pipe(
        tap(response => {
          // Manejar la respuesta del servidor y guardar el token y tiempo de expiración
          const expirationDate = new Date(new Date().getTime() + 600000); // 10 minutos
          localStorage.setItem('tokenExpiration', expirationDate.toISOString());
          localStorage.setItem('isLoggedIn', 'LogIn');
        })
      );
  }

  logout() {
    // Lógica de cierre de sesión aquí
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('tokenExpiration');
    this.router.navigate(['/login']);
  }

  resetTokenExpiration() {
    const expirationDate = new Date(new Date().getTime() + 600000); // 10 minutos
    localStorage.setItem('tokenExpiration', expirationDate.toISOString());
  }

  private isUserAuthenticated(): boolean {
    return localStorage.getItem('isLoggedIn') === 'LogIn';
  }

  cambiarUsuario(user: Usuario) {
    this.usuarioSource.next(user);
  }

  actualizarPassword(usuario: Usuario) {

    const httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

    return this.http.post(Constantes.HOST + Constantes.POST_ACTUALIZAR_PASSWORD, usuario, { headers: httpHeaders});
  }
  

}

