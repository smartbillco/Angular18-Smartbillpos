import { Routes, RouterModule } from '@angular/router';

// Definición de las rutas de la aplicación
const routes: Routes = [
  // Aquí defines tus rutas utilizando la interfaz Routes
  // Por ejemplo: { path: 'ruta', component: NombreDelComponente }
];

// Proveedores de enrutamiento de la aplicación (si es necesario)
export const appRoutingProviders: any[] = []; // Asegúrate de tener este arreglo de proveedores exportado

// Configuración del enrutador principal de la aplicación
export const routing = RouterModule.forRoot(routes);