import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS, provideHttpClient, withFetch } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Importaciones de módulos de enrutamiento y servicios
import { appRoutingProviders } from './app.routing';
import { AppRoutingModule } from './app-routing.module';
import { Constantes } from './comun/constantes';
import { LoaderService } from './services/loader.service';
import { LoaderInterceptor } from './interceptors/loader-interceptor';
import { SharedModule } from './shared/shared.module';

// Importaciones de componentes de la aplicación
import { AppComponent } from './app.component';
import { MainComponent } from './components/html-struct/main-struct/main.component';
import { SidebarComponent } from './components/html-struct/sidebar/sidebar.component';
import { HeaderComponent } from './components/html-struct/header/header.component';
import { HomeComponent } from './components/html-struct/home-content/home.component';

// Servicios
import { ToastrModule } from 'ngx-toastr';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ConfirmationService } from './services/confirmation.service';
import { ConfirmDialogComponent } from './components/complementos/confirm-dialog/confirm-dialog.component';

// Páginas
import { LoginComponent } from './components/pages/login/login.component';
import { ProveedorListComponent } from './components/pages/proveedor/proveedor-list/proveedor-list.component';
import { ProveedorAddEditComponent } from './components/pages/proveedor/proveedor-add-edit/proveedor-add-edit.component';
import { ProveedorDetComponent } from './components/pages/proveedor/proveedor-det/proveedor-det.component';
import { ClienteListComponent } from './components/pages/cliente/cliente-list/cliente-list.component';
import { ClienteAddEditComponent } from './components/pages/cliente/cliente-add-edit/cliente-add-edit.component';
import { ClienteDetComponent } from './components/pages/cliente/cliente-det/cliente-det.component';
import { ClienteMovComponent } from './components/pages/cliente/cliente-mov/cliente-mov.component';
import { CategoriaListComponent } from './components/pages/categoria/categoria-list/categoria-list.component';
import { CategoriaAddEditComponent } from './components/pages/categoria/categoria-add-edit/categoria-add-edit.component';
import { ProductoListComponent } from './components/pages/producto/producto-list/producto-list.component';
import { ProductoAddEditComponent } from './components/pages/producto/producto-add-edit/producto-add-edit.component';
import { ProductoDetComponent } from './components/pages/producto/producto-det/producto-det.component';
import { ProductoMovComponent } from './components/pages/producto/producto-mov/producto-mov.component';

// Importación de Material Angular para la configuración regional
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { BarcodeComponent } from './components/complementos/barcode/barcode.component';
import { ProductoMenuComponent } from './components/pages/producto/producto-menu/producto-menu.component';
import { CategoriaMenuComponent } from './components/pages/categoria/categoria-menu/categoria-menu.component';
import { ProveedorMenuComponent } from './components/pages/proveedor/proveedor-menu/proveedor-menu.component';
import { ClienteMenuComponent } from './components/pages/cliente/cliente-menu/cliente-menu.component';
import { LogoComponent } from './components/complementos/logo/logo.component';
import { PrincipalComponent } from './components/pages/principal/principal.component';
import { ProductoReportComponent } from './components/pages/producto/producto-report/producto-report.component';
import { FileUploadModalComponent } from './components/pages/rendiciones/file-upload-modal/file-upload-modal.component';
import { ConsolidatedViewComponent } from './components/pages/rendiciones/consolidated-view/consolidated-view.component';
import { XmlElementXpathComponent } from './components/pages/rendiciones/xml-element-xpath/xml-element-xpath.component';
import { RendicionCuentaComponent } from './components/pages/rendiciones/rendicion-cuenta/rendicion-cuenta.component';
import { ThemeSwitchComponent } from './components/complementos/theme-switch/theme-switch.component';

@NgModule({
  declarations: [
    // Componentes Principales
    AppComponent,
    MainComponent,   
    HeaderComponent,
    SidebarComponent,
    HomeComponent,
    LoginComponent,  
    ConfirmDialogComponent,
    BarcodeComponent,
    // Componentes Segundarios
    /**/
    ProveedorAddEditComponent,
    ProveedorListComponent,
    ProveedorDetComponent, 
    ProveedorMenuComponent,
    ClienteListComponent,
    ClienteAddEditComponent,
    ClienteDetComponent,
    ClienteMovComponent, 
    ClienteMenuComponent,
    CategoriaListComponent,
    CategoriaAddEditComponent,
    CategoriaMenuComponent,
    ProductoListComponent,
    ProductoAddEditComponent,
    ProductoDetComponent,
    ProductoMovComponent,
    ProductoMenuComponent,
    LogoComponent,
    PrincipalComponent,
    ProductoReportComponent,
    FileUploadModalComponent,
    ConsolidatedViewComponent,
    XmlElementXpathComponent,
    RendicionCuentaComponent,
    ThemeSwitchComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,

    FormsModule,
    RouterModule,
    HttpClientModule,
    AppRoutingModule,
    NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple' }),
    SharedModule,//guardo todo angular materia
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-bottom-center',
      preventDuplicates: true,
      
    }),
    
  ],
  // Proveedores de servicios e inyección de dependencias
  providers: [
    {
      provide: MAT_DATE_LOCALE, useValue: 'es'  // Configuración regional para Material Angular, estableciendo el idioma a español
    },
    ConfirmationService,
    // Configuración de servicios y proveedores
    Constantes,
    appRoutingProviders,
    LoaderService,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    provideHttpClient(withFetch()),
    provideAnimationsAsync()
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], 
  // Componente raíz que Angular crea e inserta en el índice HTML principal
  bootstrap: [AppComponent] 
})
// Exportación del módulo para que pueda ser utilizado en otras partes de la aplicación
export class AppModule { }
