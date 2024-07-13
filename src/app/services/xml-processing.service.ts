import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class XmlProcessingService {

  async processFile(file: File): Promise<{ registrationName: string, description: string, nestedInfo: any, xmlContent?: string }> {
    try {
      const fileContent = await this.readFileAsText(file);
      const xmlDoc = new DOMParser().parseFromString(fileContent, "application/xml");

      // Verificar errores de parseo
      const parsererrorNS = xmlDoc.getElementsByTagName("parsererror");
      if (parsererrorNS.length > 0) {
        throw new Error("Error al parsear el XML");
      }

      // Extraer la descripción (que es un XML hijo)
      const descriptionXml = this.extractElementText(xmlDoc, "//cac:Attachment/cac:ExternalReference/cbc:Description");
      if (!descriptionXml) {
        throw new Error("No se encontró la descripción en el XML");
      }

      const descriptionDoc = new DOMParser().parseFromString(descriptionXml, "application/xml");

      // Extraer el nombre de la empresa
      const registrationName = this.extractElementText(xmlDoc, "//cac:SenderParty/cac:PartyTaxScheme/cbc:RegistrationName");
      if (!registrationName) {
        throw new Error("No se encontró el nombre de la empresa en el XML");
      }

      // Extraer información específica del XML hijo
      const nestedInfo = this.extractNestedInfo(descriptionDoc);

      // Obtener el contenido completo del XML como texto
      const xmlContent = new XMLSerializer().serializeToString(xmlDoc);

      return { registrationName, description: descriptionXml, nestedInfo, xmlContent };
    } catch (error: any) {
      throw new Error(`Error al procesar el archivo XML: ${error.message || error}`);
    }
  }

  private extractElementText(xmlDoc: Document, xpath: string): string {
    const resolver = xmlDoc.createNSResolver(xmlDoc.documentElement);
    const xpathResult = xmlDoc.evaluate(xpath, xmlDoc, resolver, XPathResult.STRING_TYPE, null);
    return xpathResult.stringValue.trim();
  }

  private extractNestedInfo(descriptionDoc: Document): any {
    // Aquí extraes y procesas la información específica del XML hijo
    const nestedInfo = {
      totalFactura: this.extractElementText(descriptionDoc, "//cac:LegalMonetaryTotal/cbc:PayableAmount"),
      // Puedes agregar más campos según sea necesario
    };
    return nestedInfo;
  }

  private readFileAsText(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  }
}