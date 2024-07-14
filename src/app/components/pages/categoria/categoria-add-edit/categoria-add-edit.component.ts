import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Constantes } from "../../../../comun/constantes";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoriaProducto } from "../../../../models/categoriaProducto";
import { CategoriasService } from "../../../../services/categorias.service";
import { ToastrService } from 'ngx-toastr';

/**
 * Interfaz para describir la estructura esperada de los datos del diálogo del categoria.
 */
export interface categoriaDialogData {
  element_tabla?: CategoriaProducto;
  // Otros campos esperados en data, si los hay
}

@Component({
  selector: 'app-categoria-add-edit',
  templateUrl: './categoria-add-edit.component.html',
  styleUrls: ['./categoria-add-edit.component.css']
})
export class CategoriaAddEditComponent implements OnInit {

  listTipos = Constantes.TIPOS_DOCUMENTO; // Lista de tipos de documento importada desde Constantes
  listRegimen = Constantes.TIPOS_REGIMEN; // Lista de tipos de régimen importada desde Constantes
  form: FormGroup; // FormGroup para manejar el formulario de datos del categoria
  //maxDate = new Date(); // Fecha máxima permitida en el selector de fecha
  operacion = "Agregar"; // Operación por defecto: Agregar un categoria
  idcategoria: number | undefined; // ID del categoria a editar, si está definido

  constructor(
    public dialogRef: MatDialogRef<CategoriaAddEditComponent>, // Referencia al diálogo modal
    private fb: FormBuilder, // FormBuilder para construir el formulario
    private _categoriaService: CategoriasService, // Servicio de categoriaes para realizar operaciones CRUD
    private toastr: ToastrService, // ToastrService para mostrar notificaciones al usuario

    @Inject(MAT_DIALOG_DATA) public data: categoriaDialogData, // Datos recibidos desde el componente padre al abrir el modal
  ) {
    // Inicialización del formulario y definición de validadores
    this.form = this.fb.group({
      
      nombre: ['', [ // Campo de nombre del categoria
        Validators.required,
        Validators.minLength(3), // Mínimo 5 caracteres
        Validators.maxLength(40) // Máximo 40 caracteres
      ]],

    });

    this.idcategoria = this.data?.element_tabla?.idCategoriaProducto; // Asigna el ID del categoria desde data.element_tabla
  }

  ngOnInit(): void {
    this.configurarFormularioEdicion(); // Configura el formulario para edición si hay un ID de categoria definido
  }

  /**
   * Configura el formulario para edición, asignando valores del categoria al formulario si se está editando.
   */
  configurarFormularioEdicion(): void {
    if (this.idcategoria !== undefined && this.data?.element_tabla) {
      this.operacion = "Editar ";
      
      // Obtener y asignar datos del categoria al formulario para edición
      const categoria = this.data.element_tabla;

      this.form.patchValue({
     
        identificacion: categoria.idCategoriaProducto,
        nombre: categoria.nombre,
       
      });
    }
  }

  /**
   * Guarda los datos del categoria, realizando una operación de creación o actualización según corresponda.
   */
  guardarCategoria(): void {
    const categoria: CategoriaProducto = this.form.value; // Obtiene los valores del formulario como objeto categoria
    //alert("id_provedor "+this.idcategoria)
   
    if (this.idcategoria != undefined) {
      categoria.idCategoriaProducto = this.idcategoria; // Asigna el ID del categoria si se está editando

      this._categoriaService.updateCategoria(categoria).subscribe({
        next: () => {
          this.toastr.success('categoria actualizado con éxito', 'Éxito'); // Muestra notificación de éxito
          // Cierra el modal y actualiza la lista de categoriaes
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.toastr.error('Error al actualizar categoria', 'Error'); // Muestra notificación de error
          console.error(error);
        }
      });
    } else {

        // Convertir el objeto 'categoria' a una cadena JSON
        //const categoriaJson = JSON.stringify(categoria);
        // Mostrar el JSON en un alert
        //alert(categoriaJson);

      this._categoriaService.createCategoria(categoria).subscribe({
        next: () => {
          this.toastr.success('categoria creado con éxito', 'Éxito'); // Muestra notificación de éxito
          // Cierra el modal y actualiza la lista de categoriaes
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.toastr.error('Error al crear categoria', 'Error'); // Muestra notificación de error
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