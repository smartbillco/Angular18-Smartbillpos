import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-consolidated-view',
  templateUrl: './consolidated-view.component.html',
  styleUrls: ['./consolidated-view.component.css']
})
export class ConsolidatedViewComponent {
  totalSum: number = 0; // Inicializa la variable totalSum


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ConsolidatedViewComponent>
  ){
    this.calculateTotalSum();

  }

  calculateTotalSum(): void {
    this.totalSum = this.data.invoices.reduce((acc: number, invoice: any) => acc + invoice.total, 0);
  }

  async generatePDF(): Promise<void> {
    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage();
      const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

      page.drawText('Consolidado de Facturas', {
        x: 50,
        y: page.getHeight() - 50,
        size: 24,
        font: helveticaBoldFont,
        color: rgb(0, 0, 0),
      });

      let y = page.getHeight() - 100;
      let totalSum = 0; // Variable para almacenar la suma total

      for (const [index, invoice] of this.data.invoices.entries()) {
        y -= 30;
        totalSum += invoice.total; // Suma acumulativa de los totales
        page.drawText(`${index + 1}. ${invoice.fileName} - Total: ${invoice.total}`, {
          x: 50,
          y,
          size: 12,
          font: helveticaFont,
          color: rgb(0, 0, 0),
        });
      }

      // Mostrar la suma total al final del PDF
      y -= 30;
      page.drawText(`Suma Total: ${totalSum}`, {
        x: 50,
        y,
        size: 12,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      saveAs(blob, 'consolidado_facturas.pdf');
    } catch (error) {
      console.error('Error generando PDF:', error);
      // Manejar el error adecuadamente aquí
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}