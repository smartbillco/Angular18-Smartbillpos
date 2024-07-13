import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Constantes } from "../../../../comun/constantes";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Proveedor } from "../../../../models/proveedor";
import { ProveedoresService } from "../../../../services/proveedores.service";
import { ToastrService } from 'ngx-toastr';

/**
 * Interfaz para describir la estructura esperada de los datos del diálogo del proveedor.
 */
export interface ProveedorDialogData {
  element_tabla?: Proveedor;
  // Otros campos esperados en data, si los hay
}

@Component({
  selector: 'app-proveedor-add-edit',
  templateUrl: './proveedor-add-edit.component.html',
  styleUrls: ['./proveedor-add-edit.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProveedorAddEditComponent implements OnInit {

  listTipos = Constantes.TIPOS_DOCUMENTO; // Lista de tipos de documento importada desde Constantes
  listRegimen = Constantes.TIPOS_REGIMEN; // Lista de tipos de régimen importada desde Constantes
  form: FormGroup; // FormGroup para manejar el formulario de datos del proveedor
  //maxDate = new Date(); // Fecha máxima permitida en el selector de fecha
  operacion = "Agregar"; // Operación por defecto: Agregar un proveedor
  idProveedor: number | undefined; // ID del proveedor a editar, si está definido

  constructor(
    public dialogRef: MatDialogRef<ProveedorAddEditComponent>, // Referencia al diálogo modal
    private fb: FormBuilder, // FormBuilder para construir el formulario
    private _proveedorService: ProveedoresService, // Servicio de proveedores para realizar operaciones CRUD
    private toastr: ToastrService, // ToastrService para mostrar notificaciones al usuario

    @Inject(MAT_DIALOG_DATA) public data: ProveedorDialogData, // Datos recibidos desde el componente padre al abrir el modal
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
      nombre: ['', [ // Campo de nombre del proveedor
        Validators.required,
        Validators.minLength(5), // Mínimo 5 caracteres
        Validators.maxLength(40) // Máximo 40 caracteres
      ]],
      /*fechaRegistro: ['', Validators.required], // Selector de fecha de registro, requerido*/
      correo: ['', [ // Campo de correo electrónico
        Validators.required,
        Validators.minLength(5), // Mínimo 5 caracteres
        Validators.email, // Validación de formato de correo electrónico
        Validators.pattern('[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{1,5}') // Expresión regular para validar correo
      ]],
      telefono: ['', [ // Campo de teléfono
        Validators.required,
        Validators.pattern('^[0-9]*$'), // Validación de solo números
        Validators.minLength(10), // Mínimo 10 caracteres
        Validators.maxLength(10) // Máximo 10 caracteres
      ]],
      direccion: ['', [ // Campo de dirección
        Validators.required,
        Validators.minLength(5) // Mínimo 5 caracteres
      ]],
      regimen: [null, Validators.required], // Selector de régimen, requerido
      contacto: ['', [ // Campo de contacto
        Validators.required,
        Validators.minLength(5) // Mínimo 5 caracteres
      ]]
    });

    this.idProveedor = data?.element_tabla?.idProveedor; // Asigna el ID del proveedor desde data.element_tabla
  }

  ngOnInit(): void {
    this.configurarFormularioEdicion(); // Configura el formulario para edición si hay un ID de proveedor definido
  }

  /**
   * Configura el formulario para edición, asignando valores del proveedor al formulario si se está editando.
   */
  configurarFormularioEdicion(): void {
    if (this.idProveedor !== undefined && this.data?.element_tabla) {
      this.operacion = "Editar ";
      
      // Obtener y asignar datos del proveedor al formulario para edición
      const proveedor = this.data.element_tabla;

      this.form.patchValue({
        tipoIdentificacion: proveedor.tipoIdentificacion,
        identificacion: proveedor.identificacion,
        nombre: proveedor.nombre,
        correo: proveedor.correo,
        telefono: proveedor.telefono,
        direccion: proveedor.direccion,
        regimen: proveedor.regimen,
        contacto: proveedor.contacto
      });
    }
  }

  /**
   * Guarda los datos del proveedor, realizando una operación de creación o actualización según corresponda.
   */
  guardarProveedor(): void {
    const proveedor: Proveedor = this.form.value; // Obtiene los valores del formulario como objeto Proveedor
    //alert("id_provedor "+this.idProveedor)
   
    if (this.idProveedor != undefined) {
      proveedor.idProveedor = this.idProveedor; // Asigna el ID del proveedor si se está editando

      this._proveedorService.updateProveedor(proveedor).subscribe({
        next: () => {
          this.toastr.success('Proveedor actualizado con éxito', 'Éxito'); // Muestra notificación de éxito
          // Cierra el modal y actualiza la lista de proveedores
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.toastr.error('Error al actualizar proveedor', 'Error'); // Muestra notificación de error
          console.error(error);
        }
      });
    } else {

        // Convertir el objeto 'proveedor' a una cadena JSON
        //const proveedorJson = JSON.stringify(proveedor);
        // Mostrar el JSON en un alert
        //alert(proveedorJson);

      this._proveedorService.createProveedor(proveedor).subscribe({
        next: () => {
          this.toastr.success('Proveedor creado con éxito', 'Éxito'); // Muestra notificación de éxito
          // Cierra el modal y actualiza la lista de proveedores
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.toastr.error('Error al crear proveedor', 'Error'); // Muestra notificación de error
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