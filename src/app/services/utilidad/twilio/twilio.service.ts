import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TwilioService {
  private baseUrl = 'https://api.twilio.com/2010-04-01';
  private accountSid = 'AC6b89934e94552c57861f9960586c7faa';
  private authToken = '225f9b2f8d5c4e9590fa475b7a92b1e3';

  constructor(private http: HttpClient) {}

  private createHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(`${this.accountSid}:${this.authToken}`)
    });
  }

  private sendMessage(to: string, body: string, from: string): Observable<any> {
    const url = `${this.baseUrl}/Accounts/${this.accountSid}/Messages.json`;
    const data = new URLSearchParams();
    data.set('To', to);
    data.set('From', from);
    data.set('Body', body);

    console.log('Sending request to Twilio with data:', {
      To: to,
      From: from,
      Body: body
    });

    return this.http.post(url, data.toString(), { headers: this.createHeaders() });
  }

  sendSMS(to: string, body: string): Observable<any> {
    return this.sendMessage(to, body, '+12513129341');
  }

  sendWhatsApp(to: string, body: string): Observable<any> {
    return this.sendMessage(`whatsapp:${to}`, body, 'whatsapp:+14155238886');
  }

  sendEmail(to: string, subject: string, body: string): Observable<any> {
    // No es posible enviar correos electrónicos directamente a través de Twilio usando solo el frontend
    // Se necesitará un servicio de correo electrónico, por ejemplo, SendGrid.
    const emailServiceUrl = 'https://api.sendgrid.com/v3/mail/send';
    const emailData = {
      personalizations: [
        {
          to: [{ email: to }],
          subject: subject
        }
      ],
      from: { email: 'your-email@example.com' },
      content: [
        {
          type: 'text/plain',
          value: body
        }
      ]
    };

    return this.http.post(emailServiceUrl, emailData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_SENDGRID_API_KEY'
      })
    });
  }
}