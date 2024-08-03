// shared.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltroNombrePipe } from '../../../filtroNombre.pipe';
import { OrderByPipe } from '../../../orderBy.pipe';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    FiltroNombrePipe,
    OrderByPipe
  ],
  imports: [
    CommonModule,
    NgxPaginationModule
  ],
  exports: [
    FiltroNombrePipe,
    OrderByPipe,
    NgxPaginationModule
  ]
})
export class SharedModule { }
