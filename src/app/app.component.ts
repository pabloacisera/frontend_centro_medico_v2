import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Servicio_notificacion_socketioService } from './servicio.socket/servicio_notificacion_socket.io.service';

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
    private notificacionService: Servicio_notificacion_socketioService 
  ) {}

  ngOnInit() {
    this.notificacionService.getNotifications().subscribe((nombreCliente: string) => {
      this.toastr.info(`El paciente ${nombreCliente} se encuentra en el establecimiento`);
    });
  }
}


