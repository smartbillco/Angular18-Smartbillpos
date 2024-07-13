import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Constantes } from "../../../../comun/constantes";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Producto } from "../../../../models/producto";
import { ProductosService } from "../../../../services/productos.service";
import { ToastrService } from 'ngx-toastr';

/**
 * Interfaz para describir la estructura esperada de los datos del diálogo del Producto.
 */
export interface ProductoDialogData {
  element_tabla?: Producto;
  // Otros campos esperados en data, si los hay
}

@Component({
  selector: 'app-producto-add-edit',
  templateUrl: './producto-add-edit.component.html',
  styleUrls: ['./producto-add-edit.component.css']
})
export class ProductoAddEditComponent implements OnInit {

  listTipos = Constantes.TIPOS_DOCUMENTO; // Lista de tipos de documento importada desde Constantes
  listRegimen = Constantes.TIPOS_REGIMEN; // Lista de tipos de régimen importada desde Constantes
  form: FormGroup; // FormGroup para manejar el formulario de datos del Producto
  maxDate = new Date(); // Fecha máxima permitida en el selector de fecha
  operacion = "Agregar"; // Operación por defecto: Agregar un Producto
  idProducto: number | undefined; // ID del Producto a editar, si está definido

  constructor(
    public dialogRef: MatDialogRef<ProductoAddEditComponent>, // Referencia al diálogo modal
    private fb: FormBuilder, // FormBuilder para construir el formulario
    private _ProductoService: ProductosService, // Servicio de Productoes para realizar operaciones CRUD
    private toastr: ToastrService, // ToastrService para mostrar notificaciones al usuario
    @Inject(MAT_DIALOG_DATA) public data: ProductoDialogData, // Datos recibidos desde el componente padre al abrir el modal
  ) {
    // Inicialización del formulario y definición de validadores
    this.form = this.fb.group({
      tipoIdentificacion: [null, Validators.required], // Selector de tipo de identificación, requerido
     
      identificacion: ['', [ // Campo de identificación
        Validators.required,
        Validators.pattern('^[0-9]*$'), // Validación de solo números
        Validators.minLength(5), // Mínimo 5 caracteres
        Validators.maxLength(15) // Máximo 15 caracteres
      ]],
      nombre: ['', [ // Campo de nombre del Producto
        Validators.required,
        Validators.minLength(5), // Mínimo 5 caracteres
        Validators.maxLength(40) // Máximo 40 caracteres
      ]],
      fechaNacimiento: ['', Validators.required], // Selector de fecha de registro, requerido
      celular: ['', [ // Campo de teléfono
        Validators.required,
        Validators.pattern('^[0-9]*$'), // Validación de solo números
        Validators.minLength(10), // Mínimo 10 caracteres
        Validators.maxLength(10) // Máximo 10 caracteres
      ]],
      direccion: ['', [ // Campo de dirección
        Validators.required,
        Validators.minLength(5) // Mínimo 5 caracteres
      ]],
      correo: ['', [ // Campo de correo electrónico
        Validators.required,
        Validators.minLength(5), // Mínimo 5 caracteres
        Validators.email, // Validación de formato de correo electrónico
        Validators.pattern('[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{1,5}') // Expresión regular para validar correo
      ]],
    });

    // Asignación del idProducto si está presente en los datos inyectados
    this.idProducto = this.data?.element_tabla?.idProducto || 0;
    //alert(   "this.idProducto: " + JSON.stringify(this.idProducto)   );

  }

  ngOnInit(): void {
    this.configurarFormularioEdicion(); // Configura el formulario para edición si hay un ID de Producto definido
  }

  /**
   * Configura el formulario para edición, asignando valores del Producto al formulario si se está editando.
   */
  configurarFormularioEdicion(): void {
    if (this.idProducto != undefined) {
      this.operacion = "Editar ";
      // Obtener y asignar datos del Producto al formulario para edición
      const Producto = this.data?.element_tabla;
      if (Producto) {
        this.form.patchValue({
          /*
          tipoIdentificacion: Producto.tipoIdentificacion,
          identificacion: Producto.identificacion,
          nombre: Producto.nombre,
          celular: Producto.celular,
          direccion: Producto.direccion,
          correo: Producto.correo,
          fechaNacimiento: Producto.fechaNacimiento,*/
        });
      }
    }
  }

  /**
   * Guarda los datos del Producto, realizando una operación de creación o actualización según corresponda.
   */
  guardarProducto(): void {
    const Producto: Producto = this.form.value; // Obtiene los valores del formulario como objeto Producto
    //alert(   "this.idProducto: " + JSON.stringify(this.idProducto)   );
    Producto.idProducto = this.idProducto !== undefined ? this.idProducto : 0;  //se le agrega el ID
    //alert(   "this.idProducto: " + JSON.stringify(Producto)   );

    if (this.idProducto !== 0) {
      this._ProductoService.updateProducto(Producto).subscribe({
        next: () => {
          this.toastr.success('Producto actualizado con éxito', 'Éxito'); // Muestra notificación de éxito
          this.dialogRef.close(true); // Cierra el modal y actualiza la lista de Productoes
        },
        error: (error) => {
          this.toastr.error('Error al actualizar Producto', 'Error'); // Muestra notificación de error
          console.error(error);
        }
      });
    } else {
      this._ProductoService.createProducto(Producto).subscribe({
        next: () => {
          this.toastr.success('Producto creado con éxito', 'Éxito'); // Muestra notificación de éxito
          this.dialogRef.close(true); // Cierra el modal y actualiza la lista de Productoes
        },
        error: (error) => {
          this.toastr.error('Error al crear Producto', 'Error'); // Muestra notificación de error
          console.error(error);
        }
      });
    }
  }

  /**
   * Cierra el modal sin guardar cambios.
   */
  cancelar(): void {
    this.dialogRef.close(false); // Cierra el modal sin realizar cambios
  }
}
  