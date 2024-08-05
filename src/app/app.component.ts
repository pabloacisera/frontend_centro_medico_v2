import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SocketService } from '../socket-Service/socket.service';
import { NotificationService } from './aviso-presencia/notificacion-global.service';
import { CommonModule } from '@angular/common';
import { AvisoPresenciaComponent } from './aviso-presencia/aviso-presencia.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, AvisoPresenciaComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'MEDILINK- software de gestion de datos';

  constructor(
    private webSocketService: SocketService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.capturarRespuestaSocket();
  }

  capturarRespuestaSocket() {
    this.webSocketService.mensajeEvent().subscribe((data) => {
      const message = `El paciente ${data} se encuentra presente en el establecimiento`;
      this.notificationService.notify(message);
    });
  }
}

