import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SocketService } from './page/page-administrativos/ver-turnos-admin/websocket.service';
import { ToastrService } from 'ngx-toastr';
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
    private socketService: SocketService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.socketService.recibirNotificacion().subscribe((id: number) => {
      this.toastr.info(`El paciente con ID ${id} está presente.`, 'Notificación de Presencia');
    });
  }
}


