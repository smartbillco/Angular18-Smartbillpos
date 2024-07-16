import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Constantes } from "../../../../comun/constantes";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Cliente } from "../../../../models/cliente";
import { ClientesService } from "../../../../services/clientes.service";
import { ToastrService } from 'ngx-toastr';
import { NotificationService} from '../../../../services/utilidad/twilio/notification-service.service';

/**
 * Interfaz para describir la estructura esperada de los datos del diálogo del cliente.
 */
export interface clienteDialogData {
  element_tabla?: Cliente;
  // Otros campos esperados en data, si los hay
}

@Component({
  selector: 'app-cliente-add-edit',
  templateUrl: './cliente-add-edit.component.html',
  styleUrls: ['./cliente-add-edit.component.css']
})
export class ClienteAddEditComponent implements OnInit {

  listTipos = Constantes.TIPOS_DOCUMENTO; // Lista de tipos de documento importada desde Constantes
  listRegimen = Constantes.TIPOS_REGIMEN; // Lista de tipos de régimen importada desde Constantes
  form: FormGroup; // FormGroup para manejar el formulario de datos del cliente
  maxDate = new Date(); // Fecha máxima permitida en el selector de fecha
  operacion = "Agregar"; // Operación por defecto: Agregar un cliente
  idCliente: number | undefined; // ID del cliente a editar, si está definido

  constructor(
    public dialogRef: MatDialogRef<ClienteAddEditComponent>, // Referencia al diálogo modal
    private fb: FormBuilder, // FormBuilder para construir el formulario
    private _clienteService: ClientesService, // Servicio de clientees para realizar operaciones CRUD
    private toastr: ToastrService, // ToastrService para mostrar notificaciones al usuario
    private notificationService: NotificationService, // Inyectar el servicio de notificaciones
    @Inject(MAT_DIALOG_DATA) public data: clienteDialogData, // Datos recibidos desde el componente padre al abrir el modal
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
      nombre: ['', [ // Campo de nombre del cliente
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

    // Asignación del idCliente si está presente en los datos inyectados
    this.idCliente = this.data?.element_tabla?.id || 0;
    //alert(   "this.idCliente: " + JSON.stringify(this.idCliente)   );

  }

  ngOnInit(): void {
    this.configurarFormularioEdicion(); // Configura el formulario para edición si hay un ID de cliente definido
  }

  /**
   * Configura el formulario para edición, asignando valores del cliente al formulario si se está editando.
   */
  configurarFormularioEdicion(): void {
    if (this.idCliente != 0) {
      this.operacion = "Editar ";
      // Obtener y asignar datos del cliente al formulario para edición
      const cliente = this.data?.element_tabla;
      if (cliente) {
        this.form.patchValue({
          tipoIdentificacion: cliente.tipoIdentificacion,
          identificacion: cliente.identificacion,
          nombre: cliente.nombre,
          celular: cliente.celular,
          direccion: cliente.direccion,
          correo: cliente.correo,
          fechaNacimiento: cliente.fechaNacimiento,
        });
      }
    }
  }

  /**
   * Guarda los datos del cliente, realizando una operación de creación o actualización según corresponda.
   */
  guardarCliente(): void {
    const cliente: Cliente = this.form.value; // Obtiene los valores del formulario como objeto cliente
    //alert(   "this.idCliente: " + JSON.stringify(this.idCliente)   );
    cliente.id = this.idCliente !== undefined ? this.idCliente : 0;  //se le agrega el ID
    //alert(   "this.idCliente: " + JSON.stringify(cliente)   );

    if (this.idCliente !== 0) {
      this._clienteService.updateCliente(cliente).subscribe({
        next: () => {
          this.toastr.success('Cliente actualizado con éxito', 'Éxito'); // Muestra notificación de éxito
          this.sendNotifications(cliente.celular,"fue actualizado con éxito",cliente.nombre);
          this.dialogRef.close(true); // Cierra el modal y actualiza la lista de clientees
        },
        error: (error) => {
          this.toastr.error('Error al actualizar cliente', 'Error'); // Muestra notificación de error
          console.error(error);
        }
      });
    } else {
      this._clienteService.createCliente(cliente).subscribe({
        next: () => {
          this.toastr.success('Cliente creado con éxito', 'Éxito'); // Muestra notificación de éxito
          this.sendNotifications(cliente.celular,"fue creado con éxito",cliente.nombre);
          this.dialogRef.close(true); // Cierra el modal y actualiza la lista de clientees
        },
        error: (error) => {
          this.toastr.error('Error al crear cliente', 'Error'); // Muestra notificación de error
          console.error(error);
        }
      });
    }
  }

  /**
   * Envía notificaciones SMS y WhatsApp al número de teléfono proporcionado.
   * @param phoneNumber Número de teléfono del cliente.
   */
  private sendNotifications(phoneNumber: string, accion: string, dato: string): void {
    const smsMessage = `SmartBill - Informa que cliente[ ${dato} ] ${accion}`;
    const link = 'http://www.smartbill.com/export/data_cliente'; // Cambia esto a tu dominio y endpoint
    const whatsappMessage = `SmartBill - Informa que cliente[ ${dato} ] ${accion}\n\nSi deseas ver tus datos, haz clic en el siguiente enlace y descarga tu información: ${link}`;
  
    this.notificationService.sendNotifications("+57" + phoneNumber, smsMessage, whatsappMessage);
  }

  /**
   * Cierra el modal sin guardar cambios.
   */
  cancelar(): void {
    this.dialogRef.close(false); // Cierra el modal sin realizar cambios
  }
}