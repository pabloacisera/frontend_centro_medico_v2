import { Pipe, PipeTransform } from '@angular/core';
import { decode } from 'html-entities';

@Pipe({
  name: 'cleanEmailBody',
  standalone: true,
})
export class CleanEmailBodyPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    // Eliminar delimitadores y encabezados MIME
    let cleanedValue = value
      .replace(/--\w+\s*/g, '') // Eliminar delimitadores MIME
      .replace(/Content-[^:]+: .+?(\r?\n|\r)/g, '') // Eliminar encabezados MIME
      .replace(/<[^>]*>/g, '') // Eliminar etiquetas HTML
      .replace(/\s{2,}/g, ' ') // Reducir espacios múltiples
      .replace(/\r?\n|\r/g, '\n'); // Normalizar saltos de línea

    // Decodificar contenido quoted-printable
    cleanedValue = this.decodeQuotedPrintable(cleanedValue);

    // Decodificar Base64
    if (this.isBase64(cleanedValue)) {
      cleanedValue = this.decodeBase64(cleanedValue);
    }

    // Eliminar contenido repetido o indeseado
    cleanedValue = cleanedValue.replace(/(?:^|\n)(?:On.*wrote:|Enviado desde.*\n)/g, '');

    // Decodificar entidades HTML
    cleanedValue = decode(cleanedValue);

    // Eliminar contenido repetido (último paso para asegurar limpieza)
    const uniqueContent = this.removeDuplicateLines(cleanedValue);

    // Reemplazar caracteres especiales
    const finalContent = this.replaceSpecialCharacters(uniqueContent);

    return finalContent.trim();
  }

  private decodeQuotedPrintable(value: string): string {
    return value
      .replace(/=\r?\n/g, '') // Eliminar saltos de línea soft
      .replace(/=([A-Fa-f0-9]{2})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
  }

  private decodeBase64(value: string): string {
    try {
      return atob(value); // Decodificar Base64
    } catch (e) {
      console.error('Error decoding Base64:', e);
      return value;
    }
  }

  private isBase64(value: string): boolean {
    // Verifica si una cadena es Base64 válida
    try {
      return btoa(atob(value)) === value;
    } catch (e) {
      return false;
    }
  }

  private replaceSpecialCharacters(value: string): string {
    return value
      .replace(/Ã­/g, 'í')
      .replace(/Ã©/g, 'é')
      .replace(/Ã¡/g, 'á')
      .replace(/Ã³/g, 'ó')
      .replace(/Ãº/g, 'ú')
      .replace(/Ã±/g, 'ñ')
      .replace(/Ã¨/g, 'è')
      .replace(/Ã /g, 'à')
      .replace(/Ã²/g, 'ò');
  }

  private removeDuplicateLines(value: string): string {
    const lines = value.split('\n');
    const uniqueLines = Array.from(new Set(lines));
    return uniqueLines.join('\n');
  }
}







