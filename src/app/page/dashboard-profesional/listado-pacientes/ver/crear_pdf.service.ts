import { Injectable } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

@Injectable({
  providedIn: 'root',
})
export class Crear_pdfService {

  constructor() {
    this.setVfs();
  }

  private setVfs() {
    const pdfMakeAny = pdfMake as any;
    pdfMakeAny.vfs = pdfFonts.pdfMake.vfs;
  }

  public formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  public generatePdf(datosDeCliente: any, resultados: any[], valorSumar: number, userData: any) {
    const docDefinition = {
      content: [
        {
          columns: [
            {
              text: 'Institución Médica XYZ',
              style: 'institutionName'
            },
            {
              text: 'Dirección: Calle Falsa 123, Ciudad, País\nTeléfono: +123 456 7890',
              style: 'institutionDetails',
              alignment: 'right'
            }
          ],
          margin: [0, 20, 0, 10] // Ajusta el margen superior para reducir el espacio
        },
        {
          text: 'Informe de Resultados',
          style: 'reportTitle',
          margin: [0, 10, 0, 10] // Reduce el margen para que el título esté más cerca de los datos
        },
        {
          columns: [
            {
              width: '50%',
              stack: [
                { text: `Paciente: ${datosDeCliente.nombre}`, style: 'patientInfo' },
                { text: `Protocolo: ${datosDeCliente.protocolo}`, style: 'patientInfo' },
                { text: `Fecha de Nacimiento: ${this.formatDate(datosDeCliente.nacimiento)}`, style: 'patientInfo' },
                { text: `Edad: ${datosDeCliente.edad}`, style: 'patientInfo' },
                { text: `Teléfono: ${datosDeCliente.telefono}`, style: 'patientInfo' }
              ]
            },
            {
              width: '50%',
              stack: [
                { text: `Email: ${datosDeCliente.email}`, style: 'patientInfo' },
                { text: `Dirección: ${datosDeCliente.direccion}`, style: 'patientInfo' },
                { text: `Localidad: ${datosDeCliente.localidad}`, style: 'patientInfo' },
                { text: `Seguridad Social: ${datosDeCliente.seguridadSocial}`, style: 'patientInfo' },
                { text: `Observaciones: ${datosDeCliente.obs}`, style: 'patientInfo' }
              ]
            }
          ],
          margin: [0, 10, 0, 20] // Reduce el margen superior para los datos del paciente
        },
        { text: `Creado el: ${this.formatDate(datosDeCliente.createdAt)}`, style: 'subheader' },
        { text: 'Profesional Interviniente', style: 'header', margin: [0, 20, 0, 10] },
        {
          stack: [
            { text: `Nombre: ${userData.nombre}`, style: 'professionalInfo' },
            { text: `Área: ${userData.area}`, style: 'professionalInfo' },
            { text: `Email: ${userData.email}`, style: 'professionalInfo' }
          ],
          margin: [0, 0, 0, 20]
        },
        { text: 'Resultados', style: 'header', margin: [0, 20, 0, 10] },
        {
          style: 'tableExample',
          table: {
            headerRows: 1,
            widths: [60, '*', '*', '*', '*'],
            body: [
              [
                { text: 'Código', style: 'tableHeader' },
                { text: 'Determinación', style: 'tableHeader' },
                { text: 'Resultado', style: 'tableHeader' },
                { text: 'Unidad Base', style: 'tableHeader' },
                { text: 'Total U.B', style: 'tableHeader' }
              ],
              ...resultados.map(resultado => [
                resultado.codigo,
                resultado.determinacion,
                resultado.resultado,
                resultado.unidadBase,
                `$ ${resultado.valorTotal}`
              ])
            ]
          },
          layout: 'lightHorizontalLines'
        },
        {
          text: `Valor Total: $ ${valorSumar}`,
          style: 'total',
          alignment: 'right',
          margin: [0, 10, 0, 10] // Espacio entre el total y la firma
        },
        {
          columns: [
            {},
            {
              stack: [
                {
                  text: 'Firma Profesional',
                  style: 'signature',
                  margin: [0, 20, 0, 10] // Espacio entre la firma y el pie de página
                },
              ],
              alignment: 'right'
            }
          ]
        }
      ],
      styles: {
        institutionName: {
          fontSize: 16,
          bold: true,
          color: '#333'
        },
        institutionDetails: {
          fontSize: 10,
          color: '#555'
        },
        reportTitle: {
          fontSize: 18,
          bold: true,
          alignment: 'center'
        },
        patientInfo: {
          fontSize: 10, // Tamaño de fuente reducido
          color: '#333'
        },
        header: {
          fontSize: 16,
          bold: true
        },
        subheader: {
          fontSize: 14,
          bold: true
        },
        professionalInfo: {
          fontSize: 10, // Tamaño de fuente reducido
          color: '#333'
        },
        tableExample: {
          margin: [0, 10, 0, 20]
        },
        tableHeader: {
          fontSize: 12,
          bold: true
        },
        total: {
          fontSize: 14,
          bold: true
        },
        signature: {
          fontSize: 14,
          bold: true,
          color: '#000'
        },
        footer: {
          fontSize: 12,
          color: '#777'
        }
      },
      pageMargins: [40, 80, 40, 100], // Ajuste de márgenes para la firma y el pie de página
      footer: function (currentPage: number, pageCount: number) {
        return [
          {
            text: 'Software Medilink\nCorreo: software.medilink.business@gmail.com',
            style: 'footer',
            alignment: 'center',
            margin: [0, 0, 0, 10]
          }
        ];
      },
    };

    // Genera y abre el PDF
    pdfMake.createPdf(docDefinition).download(`${datosDeCliente.nombre}-resultados-paciente`);
  }
}













