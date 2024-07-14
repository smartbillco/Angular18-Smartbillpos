import { Component } from '@angular/core';
import { XmlPathService } from '../../../../services/xml-path-service.service';

interface XPathResult {
  xpath: string;
  value: string;
}

@Component({
  selector: 'app-xml-element-xpath',
  templateUrl: './xml-element-xpath.component.html',
  styleUrls: ['./xml-element-xpath.component.css']
})
export class XmlElementXpathComponent {

  selectedFile: File | null = null;
  elementName: string = '';
  xpathResult: XPathResult | null = null;
  error: string | null = null;

  constructor(private xmlPathService: XmlPathService) { }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFile = input.files[0];
    }
  }

  async findXPath(): Promise<void> {
    console.log('Inicio de findXPath');
  
    if (!this.selectedFile || !this.elementName) {
      this.error = 'Por favor selecciona un archivo XML y especifica el nombre del elemento.';
      console.log('Error:', this.error);
      return;
    }
  
    console.log('Archivo seleccionado:', this.selectedFile);
    console.log('Nombre del elemento:', this.elementName);
  
    try {
      this.xpathResult = await this.xmlPathService.findXPathForElement(this.selectedFile, this.elementName);
      this.error = null;
      console.log('Resultado XPath:', this.xpathResult);
    } catch (error: any) {
      this.error = error.message;
      this.xpathResult = null;
      console.error('Error:', this.error);
    }
  }
}