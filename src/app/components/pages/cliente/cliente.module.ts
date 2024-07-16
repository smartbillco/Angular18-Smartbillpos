// cliente.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module'; // Ajusta la ruta según la ubicación real

import { ClienteListComponent } from './cliente-list/cliente-list.component';
import { ClienteAddEditComponent } from './cliente-add-edit/cliente-add-edit.component';
import { ClienteDetComponent } from './cliente-det/cliente-det.component';
import { ClienteMovComponent } from './cliente-mov/cliente-mov.component';
import { ClienteMenuComponent } from './cliente-menu/cliente-menu.component';
import { LogoComponent } from '../../complementos/logo/logo.component';
import { HeaderComponent } from '../../html-struct/header/header.component';

const routes: Routes = [
  { path: '', component: ClienteListComponent },
  { path: 'add', component: ClienteAddEditComponent },
  { path: 'edit/:id', component: ClienteAddEditComponent },
  { path: ':id', component: ClienteDetComponent },
  { path: ':id/movimientos', component: ClienteMovComponent },
  { path: 'menu', component: ClienteMenuComponent },
  { path: 'logo', component: LogoComponent },
  { path: 'header', component: HeaderComponent }
];

@NgModule({
  declarations: [
    ClienteListComponent,
    ClienteAddEditComponent,
    ClienteDetComponent,
    ClienteMovComponent,
    ClienteMenuComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class ClienteModule { }