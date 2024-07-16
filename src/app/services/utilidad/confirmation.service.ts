import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ConfirmDialogComponent } from '../../components/complementos/confirm-dialog/confirm-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationService {

  constructor(private dialog: MatDialog) { }

  /**
   * Muestra un diálogo de confirmación.
   * @param message El mensaje de confirmación a mostrar.
   * @returns Observable<boolean> Un observable que emite true si se confirma, false si se cancela.
   */
  confirm(message: string, enterAnimationDuration: string, exitAnimationDuration: string): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: { message }
    });

    return dialogRef.afterClosed();
  }
}

