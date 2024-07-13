import { Component, OnInit, OnDestroy } from '@angular/core';
import Chart from 'chart.js/auto';
import { ProductosService } from '../../../../services/productos.service';
import { Producto } from '../../../../models/producto';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-producto-report',
  templateUrl: './producto-report.component.html',
  styleUrls: ['./producto-report.component.css']
})
export class ProductoReportComponent implements OnInit, OnDestroy {

  productos: Producto[] = [];
  filteredProductos: Producto[] = [];
  chart: Chart | undefined;

  filtroMinimo: number = 0;
  filtroMaximo: number = 0;

  constructor(private productosService: ProductosService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.loadProductos();
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  loadProductos(): void {
    this.productosService.getAllProductos().subscribe({
      next: (data: Producto[]) => {
        console.log('Respuesta de la API:', data);
        if (data && data.length > 0) {
          this.productos = data;
          this.filteredProductos = this.productos.slice(); // Clonar array inicialmente
          console.log('Productos cargados:', this.productos);
          
          this.filtroMaximo = Math.max(...this.productos.map(producto => producto.inventario));
          this.filtroMinimo = this.filtroMaximo / 2;
          
          this.applyFilter();
          this.renderChart();
        } else {
          console.error('No se recibieron productos o la lista está vacía.', data);
          this.toastr.error('No se recibieron productos o la lista está vacía.', 'Error');
        }
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
        this.toastr.error('Error al cargar productos.', 'Error');
      }
    });
  }

  applyFilter(): void {
    if (this.filtroMinimo < 0 || this.filtroMaximo < 0 || this.filtroMinimo > this.filtroMaximo) {
      this.toastr.error('Valores de filtro inválidos.', 'Error');
      return;
    }
    
    this.filteredProductos = this.productos.filter(producto =>
      producto.inventario >= this.filtroMinimo && producto.inventario <= this.filtroMaximo
    );
    
    this.filteredProductos.sort((a, b) => b.inventario - a.inventario);
    this.renderChart();
  }

  renderChart(): void {
    if (this.chart) {
      this.chart.destroy();
    }

    const nombresProductos = this.filteredProductos.map(producto => producto.nombre);
    const inventariosProductos = this.filteredProductos.map(producto => producto.inventario);

    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: nombresProductos,
        datasets: [{
          label: 'Inventario',
          data: inventariosProductos,
          backgroundColor: this.getBackgroundColors(inventariosProductos.length),
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              font: {
                size: 14
              }
            }
          }
        }
      }
    });
  }

  getBackgroundColors(count: number): string[] {
    const backgroundColors = [];
    for (let i = 0; i < count; i++) {
      backgroundColors.push(i < 3 ? 'rgba(255, 99, 132, 0.5)' : 'rgba(54, 162, 235, 0.5)');
    }
    return backgroundColors;
  }

  updateFilter(): void {
    if (this.filtroMinimo < 0 || this.filtroMaximo < 0 || this.filtroMinimo > this.filtroMaximo) {
      this.toastr.error('Valores de filtro inválidos.', 'Error');
      return;
    }
    this.applyFilter();
  }

}