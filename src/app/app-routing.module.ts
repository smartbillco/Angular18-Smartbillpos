import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './comun/auth.guard';
import { MainComponent } from './components/html-struct/main-struct/main.component';
import { HomeComponent } from './components/html-struct/home-content/home.component';
import { LoginComponent } from './components/pages/login/login.component';
import { ProveedorListComponent } from './components/pages/proveedor/proveedor-list/proveedor-list.component';
import { ClienteListComponent } from './components/pages/cliente/cliente-list/cliente-list.component';
import { CategoriaListComponent } from './components/pages/categoria/categoria-list/categoria-list.component';
import { ProductoListComponent } from './components/pages/producto/producto-list/producto-list.component';
import { PrincipalComponent } from './components/pages/principal/principal.component';
import { XmlElementXpathComponent } from './components/pages/rendiciones/xml-element-xpath/xml-element-xpath.component';
import { FileUploadModalComponent } from './components/pages/rendiciones/file-upload-modal/file-upload-modal.component';
import { RendicionCuentaComponent } from './components/pages/rendiciones/rendicion-cuenta/rendicion-cuenta.component';

const routes: Routes = [
  { path: '', component: PrincipalComponent }, // Página de inicio
  { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
  { 
    path: 'home', 
    component: MainComponent, 
    canActivate: [AuthGuard], 
    children: [
      { path: '', component: HomeComponent },
      { path: 'proveedores', component: ProveedorListComponent },
      { path: 'clientes', component: ClienteListComponent },
      { path: 'categorias', component: CategoriaListComponent },
      { path: 'productos', component: ProductoListComponent },
    ]
  },
  { path: 'rendiciones', component: RendicionCuentaComponent } // Ruta independiente
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }