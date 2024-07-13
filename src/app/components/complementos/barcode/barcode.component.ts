import { Component, Input, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import JsBarcode from 'jsbarcode';

@Component({
  selector: 'app-barcode',
  template: `<svg #barcode></svg>`,
  styleUrls: ['./barcode.component.css']
})
export class BarcodeComponent implements OnChanges {
  @Input() value?: string;
  @ViewChild('barcode', { static: true }) barcode?: ElementRef<SVGElement>;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['value']) {
      this.generateBarcode();
    }
  }

  generateBarcode() {
    if (this.value) {
      JsBarcode(this.barcode?.nativeElement, this.value, {
        format: 'CODE128',
        displayValue: true
      });
    }
  }
}