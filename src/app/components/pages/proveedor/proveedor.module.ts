import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module'; 

import { ProveedorListComponent } from './proveedor-list/proveedor-list.component';
import { ProveedorAddEditComponent } from './proveedor-add-edit/proveedor-add-edit.component';
import { ProveedorDetComponent } from './proveedor-det/proveedor-det.component';
import { ProveedorMenuComponent } from './proveedor-menu/proveedor-menu.component';

const routes: Routes = [
  { path: '', component: ProveedorListComponent },
  { path: 'add', component: ProveedorAddEditComponent },
  { path: 'edit/:id', component: ProveedorAddEditComponent },
  { path: 'detail/:id', component: ProveedorDetComponent },
  { path: 'menu', component: ProveedorMenuComponent }
];

@NgModule({
  declarations: [
    ProveedorListComponent,
    ProveedorAddEditComponent,
    ProveedorDetComponent,
    ProveedorMenuComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule 
  ]
})
export class ProveedorModule { }