import { Injectable } from '@angular/core';
import * as xmljs from 'xml-js';

@Injectable({
  providedIn: 'root'
})
export class XmlProcessingService {

  async processFile(file: File): Promise<any> {
    try {
      const fileContent = await this.readFileAsText(file);
      const xmlDoc = new DOMParser().parseFromString(fileContent, "application/xml");

      const parsererrorNS = xmlDoc.getElementsByTagName("parsererror");
      if (parsererrorNS.length > 0) {
        throw new Error("Error al parsear el XML");
      }

      const xmlContent = new XMLSerializer().serializeToString(xmlDoc);

      const id = this.extractElementText(xmlDoc, "//cac:SenderParty/cac:PartyTaxScheme/cbc:CompanyID");
      if (!id) {
        throw new Error("No se encontró id de la empresa en el XML");
      }

      const registrationName = this.extractElementText(xmlDoc, "//cac:SenderParty/cac:PartyTaxScheme/cbc:RegistrationName");
      if (!registrationName) {
        throw new Error("No se encontró el nombre de la empresa en el XML");
      }

      const documentReference = this.extractElementText(xmlDoc, "//cac:ParentDocumentLineReference/cac:DocumentReference/cbc:ID");
      if (!documentReference) {
        throw new Error("No se encontró el numero de la factura en el XML");
      }

      const issueDateString = this.extractElementText(xmlDoc, "//cbc:IssueDate");
      if (!issueDateString) {
        throw new Error("No se encontró la fecha de la factura en el XML");
      }
      const issueDate = new Date(issueDateString);

      const issueTimeString = this.extractElementText(xmlDoc, "//cbc:IssueTime");
      if (!issueTimeString) {
        throw new Error("No se encontró la hora de la factura en el XML");
      }

      //------------------------------------------------------------------------------
      const xmlContentDescription = this.extractElementText(xmlDoc, "//cac:Attachment/cac:ExternalReference/cbc:Description");
      if (!xmlContentDescription) {
        throw new Error("No se encontró la descripción en el XML");
      }

      const xmlContentDescriptionJson = await this.convertXmlToJson(xmlContentDescription);

      let totalFactura;
      if (xmlContentDescriptionJson['Invoice'] && xmlContentDescriptionJson['Invoice']['cac:LegalMonetaryTotal']['cbc:PayableAmount']._text) {
        totalFactura = parseFloat(xmlContentDescriptionJson['Invoice']['cac:LegalMonetaryTotal']['cbc:PayableAmount']._text);
      } else if (xmlContentDescriptionJson['CreditNote'] && xmlContentDescriptionJson['CreditNote']['cac:LegalMonetaryTotal']['cbc:PayableAmount']._text) {
        totalFactura = parseFloat(xmlContentDescriptionJson['CreditNote']['cac:LegalMonetaryTotal']['cbc:PayableAmount']._text);
      } else {
        throw new Error("No se encontró el valor total de la factura en el XML");
      }
      //------------------------------------------------------------------------------

      return {
        id,
        registrationName,
        documentReference,
        issueDate,
        issueTime: issueTimeString,
        totalFactura,
        xmlContent,
        xmlContentDescriptionJson,
      };
    } catch (error: any) {
      throw new Error(`Error al procesar el archivo XML: ${error.message || error}`);
    }
  }

  private extractElementText(xmlDoc: Document, xpath: string): string {
    const resolver = xmlDoc.createNSResolver(xmlDoc.documentElement);
    const xpathResult = xmlDoc.evaluate(xpath, xmlDoc, resolver, XPathResult.STRING_TYPE, null);
    return xpathResult.stringValue.trim();
  }

  private convertXmlToJson(xml: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const options = { compact: true, ignoreComment: true, spaces: 4 };
      try {
        const result = xmljs.xml2js(xml, options);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
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