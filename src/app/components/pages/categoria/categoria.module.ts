import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms'; 

import { CategoriaListComponent } from './categoria-list/categoria-list.component';
import { CategoriaAddEditComponent } from './categoria-add-edit/categoria-add-edit.component';
import { CategoriaMenuComponent } from './categoria-menu/categoria-menu.component';

import { SharedModule } from '../../../shared/shared.module';
import { LogoComponent } from '../../complementos/logo/logo.component';
import { HeaderComponent } from '../../html-struct/header/header.component';

const routes: Routes = [
  { path: '', component: CategoriaListComponent },
  { path: 'add', component: CategoriaAddEditComponent },
  { path: 'menu', component: CategoriaMenuComponent },
  { path: 'logo', component: LogoComponent },
  { path: 'header', component: HeaderComponent }];

@NgModule({
  declarations: [
    CategoriaListComponent,
    CategoriaAddEditComponent,
    CategoriaMenuComponent,

  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class CategoriaModule { }