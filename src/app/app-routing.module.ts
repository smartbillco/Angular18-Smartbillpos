import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { AuthGuard } from './comun/auth.guard';
import { MainComponent } from './components/html-struct/main-struct/main.component';
import { HomeComponent } from './components/html-struct/home-content/home.component';
import { LoginComponent } from './components/pages/login/login.component';
import { PrincipalComponent } from './components/pages/principal/principal.component';
import { CompanyInvoiceListComponent } from './components/pages/rendiciones/company-invoice-list/company-invoice-list.component';

const routes: Routes = [
  { path: '', component: PrincipalComponent },
  { path: 'rendiciones', component: CompanyInvoiceListComponent },
  { path: 'login', component: LoginComponent },
  { 
    path: 'home', 
    component: MainComponent, 
    canActivate: [AuthGuard], 
    children: [
      { path: '', component: HomeComponent },
      { path: 'proveedores', loadChildren: () => import('./components/pages/proveedor/proveedor.module').then(m => m.ProveedorModule) },
      { path: 'clientes', loadChildren: () => import('./components/pages/cliente/cliente.module').then(m => m.ClienteModule) },
      { path: 'categorias', loadChildren: () => import('./components/pages/categoria/categoria.module').then(m => m.CategoriaModule) },
      { path: 'productos', loadChildren: () => import('./components/pages/producto/producto.module').then(m => m.ProductoModule) },
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],

  //imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }