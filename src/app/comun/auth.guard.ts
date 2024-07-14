import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    const isLoggedIn = localStorage.getItem('isLoggedIn');

    if (next.routeConfig && next.routeConfig.path === 'login') {
      // Si el usuario está autenticado y trata de ir a login, redirigir a home
      if (isLoggedIn === 'LogIn') {
        this.router.navigate(['/home']);
        return false;
      }
      return true;
    }

    // Si el usuario no está autenticado y trata de ir a cualquier otra ruta, redirigir a login
    if (isLoggedIn !== 'LogIn') {
      this.router.navigate(['/app-principal']);
      return false;
    }

    return true;
  }
}