// categoria.module.ts

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { CategoriaListComponent } from './categoria-list/categoria-list.component';
import { CategoriaAddEditComponent } from './categoria-add-edit/categoria-add-edit.component';

import { SharedModule } from '../../../shared/shared.module';
// Otros componentes de categoría

const routes: Routes = [
  { path: '', component: CategoriaListComponent },
  { path: 'add', component: CategoriaAddEditComponent },
  // Otras rutas de categoría
];

@NgModule({
  declarations: [
    CategoriaListComponent,
    CategoriaAddEditComponent
    // Otros componentes de categoría que necesites declarar
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class CategoriaModule { }