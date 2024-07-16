import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms'; 

import { ProductoListComponent } from './producto-list/producto-list.component';
import { ProductoAddEditComponent } from './producto-add-edit/producto-add-edit.component';
import { ProductoDetComponent } from './producto-det/producto-det.component';
import { ProductoMovComponent } from './producto-mov/producto-mov.component';
import { ProductoReportComponent } from './producto-report/producto-report.component';
import { ProductoMenuComponent } from './producto-menu/producto-menu.component';
import { SharedModule } from '../../../shared/shared.module';
import { LogoComponent } from '../../complementos/logo/logo.component';
import { HeaderComponent } from '../../html-struct/header/header.component';

const routes: Routes = [
  { path: '', component: ProductoListComponent },
  { path: 'add', component: ProductoAddEditComponent },
  { path: 'edit/:id', component: ProductoAddEditComponent },
  { path: 'detail/:id', component: ProductoDetComponent },
  { path: 'movimientos', component: ProductoMovComponent },
  { path: 'reportes', component: ProductoReportComponent },
  { path: 'menu', component: ProductoMenuComponent },
  { path: 'logo', component: LogoComponent },
  { path: 'header', component: HeaderComponent }
];

@NgModule({
  declarations: [
    ProductoListComponent,
    ProductoAddEditComponent,
    ProductoDetComponent,
    ProductoMovComponent,
    ProductoReportComponent,
    ProductoMenuComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    FormsModule, 

  ]
})
export class ProductoModule { }