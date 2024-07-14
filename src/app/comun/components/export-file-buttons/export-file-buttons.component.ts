import { Component, EventEmitter, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-export-file-buttons",
  templateUrl: "./export-file-buttons.component.html",
  styleUrls: ["./export-file-buttons.component.scss"],
})
export class ExportFileButtonsComponent implements OnInit {
  @Output()
  pdfExportEmitter = new EventEmitter<string>();

  @Output()
  excelExportEmitter = new EventEmitter<string>();

  constructor() {}

  ngOnInit() {}

  exportListToPdf() {
    this.pdfExportEmitter.emit("");
  }

  exportListToExcel() {
    this.excelExportEmitter.emit("");
  }
}
