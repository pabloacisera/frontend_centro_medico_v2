import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SocketService } from '../socket-Service/socket.service';
import { NotificationService } from './aviso-presencia/notificacion-global.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet], // Elimina AvisoPresenciaComponent de aquí
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend_v2';

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
