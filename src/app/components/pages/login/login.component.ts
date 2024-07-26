import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../../models/usuario';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Constantes } from '../../../comun/constantes';
import { ToastrService } from 'ngx-toastr'; // Importa ToastrService

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],


})
export class LoginComponent implements OnInit {

  usuario: Usuario;
  LoginUserData = {};
  correoOlvidado!: string;

  constructor(
    private _auth: AuthService,
    private router: Router,
    private userService: AuthService,
    private toastr: ToastrService, // Inyecta ToastrService
  ) {
    this.usuario = new Usuario();
  }

  ngOnInit() {}

  login() {
    if (this.usuario.email === '' || this.usuario.password === '') {
      this.toastr.error('Verifique si ha escrito su usuario y contraseña', 'Campos vacíos');
      return;
    }

    if (!this.validateEmail(this.usuario.email)) {
      this.toastr.warning('Debe ingresar un correo electrónico válido.', 'Correo inválido');
      return;
    }


    // Llamada a servicio de autenticación de usuario
    this._auth.login(this.usuario).subscribe((res: any) => {
      const resLogin = res;
      if (resLogin.code === '1') {
        this.usuario.tipo = resLogin.msg.tipo;
        this.usuario.setRol();
        this.usuario.empresa = resLogin.msg.empresa;

        // this.inicioSesion.emit(this.usuario);
        this.userService.cambiarUsuario(this.usuario);
        localStorage.setItem('isLoggedIn', 'LogIn');
        localStorage.setItem('nombreEmpleado', resLogin.msg.nombreEmpleado);
        localStorage.setItem('idUsuario', String(resLogin.msg.id));
        localStorage.setItem('idEmpleado', String(resLogin.msg.idEmpleado));
        localStorage.setItem('correo', this.usuario.email);
        localStorage.setItem('rol', this.usuario.rol);
        localStorage.setItem('tipoUsuario', String(this.usuario.tipo));
        localStorage.setItem('idEmpresa', String(this.usuario.empresa.id));
        localStorage.setItem('nit', String(this.usuario.empresa.nit));

        this.toastr.success('Hola, ' + this.usuario.email + ' has iniciado sesión exitosamente', 'Bienvenido');
        this.router.navigate(['/home']);
      } else {
        this.toastr.error('Usuario y/o contraseña inválidos', 'Login');
      }
    }, error => {
      this.handleError(error);
    }, () => {
    });
  }

  resetPassword() {
    if (!this.validateEmail(this.correoOlvidado)) {
      this.toastr.warning('Debe ingresar un correo electrónico válido.', 'Correo inválido');
      return;
    }

    if (this.correoOlvidado === '' || this.correoOlvidado == null) {
      this.toastr.warning('El campo correo es obligatorio', 'Error');
      return;
    }

    const userActualizar = new Usuario();
    userActualizar.email = this.correoOlvidado;
    this.userService.actualizarPassword(userActualizar).subscribe((response) => {
      const respuesta = JSON.parse(response.toString());
      const code = respuesta.code;
      if (code === '1') {
        this.toastr.success(Constantes.CORREO_ENVIADO, 'Listo');
        this.router.navigate(['/login']);
      } else if (code === '2') { // EL USUARIO NO EXISTE
        this.toastr.error(Constantes.CORREO_NO_EXISTE, 'Error');
        this.router.navigate(['/login']);
      }
    }, error => this.handleError(error));
  }

  private handleError(error: HttpErrorResponse) {
    // Manejar errores aquí
  }

  validateEmail(email: string): boolean {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

}