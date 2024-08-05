import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { VerTurnosAdminService } from './page/page-administrativos/ver-turnos-admin/ver-turnos-admin.service';
;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'MEDILINK- software de gestion de datos';

  constructor(
    private toastr: ToastrService,
    private notificacion: VerTurnosAdminService,
  ) {}

  ngOnInit() {
    this.notificacion.disparadorDeNotificaciones.subscribe( data=> {
      this.toastr.info(`El paciente ${data} se encuentra en el establecimiento`, 'AVISO')
    })
  }
}


