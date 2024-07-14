import { Injectable } from '@angular/core';
import { TwilioService } from './twilio.service';
import { ToastrService } from 'ngx-toastr';
import { Observable, catchError, tap, of } from 'rxjs';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private twilioService: TwilioService,
    private toastr: ToastrService
  ) {}

  sendNotifications(phoneNumber: string, smsMessage: string, whatsappMessage: string): void {
    
    // Enviar mensaje SMS
    this.twilioService.sendSMS(phoneNumber, smsMessage).pipe(
      tap(() => {
        this.toastr.success('Mensaje SMS enviado exitosamente');
      }),
      catchError(error => {
        this.toastr.error('Error al enviar mensaje SMS');
        return of(null); // Continuar a pesar del error
      })
    ).subscribe();

    // Enviar mensaje WhatsApp
    this.twilioService.sendWhatsApp(phoneNumber, whatsappMessage).pipe(
      tap(() => {
        this.toastr.success('Mensaje WhatsApp enviado exitosamente');
      }),
      catchError(error => {
        this.toastr.error('Error al enviar mensaje WhatsApp');
        return of(null); // Continuar a pesar del error
      })
    ).subscribe();
  }
}