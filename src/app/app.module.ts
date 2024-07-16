import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';

import { appRoutingProviders } from './app.routing';
import { AppRoutingModule } from './app-routing.module';
import { Constantes } from './comun/constantes';
import { LoaderService } from './services/loader.service';
import { LoaderInterceptor } from './interceptors/loader-interceptor';
import { SharedModule } from './shared/shared.module';

import { AppComponent } from './app.component';
import { MainComponent } from './components/html-struct/main-struct/main.component';
import { SidebarComponent } from './components/html-struct/sidebar/sidebar.component';
import { HomeComponent } from './components/html-struct/home-content/home.component';
import { LoginComponent } from './components/pages/login/login.component';
import { ConfirmDialogComponent } from './components/complementos/confirm-dialog/confirm-dialog.component';
import { BarcodeComponent } from './components/complementos/barcode/barcode.component';
import { PrincipalComponent } from './components/pages/principal/principal.component';
import { FileUploadModalComponent } from './components/pages/rendiciones/file-upload-modal/file-upload-modal.component';
import { ConsolidatedViewComponent } from './components/pages/rendiciones/consolidated-view/consolidated-view.component';
import { XmlElementXpathComponent } from './components/pages/rendiciones/xml-element-xpath/xml-element-xpath.component';
import { ThemeSwitchComponent } from './components/complementos/theme-switch/theme-switch.component';
import { ConfirmationService } from './services/confirmation.service';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { CompanyInvoiceChartComponent } from './components/pages/rendiciones/company-invoice-chart/company-invoice-chart.component';
import { CompanyInvoiceListComponent } from './components/pages/rendiciones/company-invoice-list/company-invoice-list.component';


@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    SidebarComponent,
    HomeComponent,
    LoginComponent,
    ConfirmDialogComponent,
    BarcodeComponent,
    PrincipalComponent,
    FileUploadModalComponent,
    ConsolidatedViewComponent,
    XmlElementXpathComponent,
    ThemeSwitchComponent,
    CompanyInvoiceListComponent,
    CompanyInvoiceChartComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    CommonModule,
    AppRoutingModule,
    NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple' }),
    SharedModule,
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-bottom-center',
      preventDuplicates: true,
    }),
  ],
  exports: [CompanyInvoiceChartComponent],

  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es' },
    ConfirmationService,
    Constantes,
    appRoutingProviders,
    LoaderService,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }