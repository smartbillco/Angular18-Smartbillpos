import { Injectable } from '@angular/core';

interface XPathResult {
  xpath: string;
  value: string;
}

@Injectable({
  providedIn: 'root'
})
export class XmlPathService {

  constructor() { }

  async findXPathForElement(file: File, elementName: string): Promise<XPathResult | null> {
    try {
      const fileContent = await this.readFileAsText(file);
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(fileContent, "application/xml");

      // Verificar si hay errores de parseo
      const parsererrorNS = xmlDoc.getElementsByTagName("parsererror");
      if (parsererrorNS.length > 0) {
        throw new Error("Error al parsear el XML");
      }

      // Lógica para encontrar la ruta XPath del elemento especificado y su valor
      const xpathResult = this.getXPathForElement(xmlDoc, elementName);

      return xpathResult;
    } catch (error) {
      console.error('Error al encontrar la ruta XPath:', error);
      return null;
    }
  }

  private getXPathForElement(xmlDoc: Document, elementName: string): XPathResult | null {
    const element = xmlDoc.getElementsByTagName(elementName)[0];
    if (!element) {
      console.warn(`Elemento "${elementName}" no encontrado.`);
      return null;
    }
    const xpath = this.calculateXPath(element);
    const value = element.textContent || '';
    return { xpath, value };
  }

  private calculateXPath(node: Node): string {
    const doc = node.ownerDocument;
    if (!doc) {
      return '';
    }

    let path = '';
    let sibling = node;
    while (sibling !== null && sibling.nodeType === Node.ELEMENT_NODE) {
      const nodeName = sibling.nodeName;
      if (!nodeName) {
        break;
      }

      let suffix = '';
      let rank = 1;
      let preceding = sibling.previousSibling;
      while (preceding !== null) {
        if (preceding.nodeName === nodeName) {
          rank++;
        }
        preceding = preceding.previousSibling;
      }
      suffix = `[${rank}]`;

      // Mantener el nodeName tal como está, sin convertirlo a minúsculas
      path = '/' + nodeName + suffix + path;
      sibling = sibling.parentNode!;
    }

    return path;
  }

  private readFileAsText(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => {
        console.error('Error al leer el archivo:', reader.error);
        reject(reader.error);
      };
      reader.readAsText(file);
    });
  }
}