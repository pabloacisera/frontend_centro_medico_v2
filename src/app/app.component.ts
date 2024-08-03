import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AvisoPresenciaComponent } from './aviso-presencia/aviso-presencia.component';
import { WebsocketService } from './services/websocket.service';
import { NotificationService } from './aviso-presencia/notificacion-global.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AvisoPresenciaComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend_v2';

  constructor(
    private webSocketService: WebsocketService,
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

