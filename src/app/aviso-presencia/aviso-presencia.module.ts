import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvisoPresenciaComponent } from './aviso-presencia.component';

@NgModule({
  declarations: [AvisoPresenciaComponent],
  imports: [CommonModule],
  exports: [AvisoPresenciaComponent]  // Asegúrate de exportar el componente si se usa en otros módulos
})
export class AvisoPresenciaModule { }
