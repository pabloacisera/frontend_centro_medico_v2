import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;
  private readonly uri = 'https://backend-centro-medico-4.onrender.com'; // Cambia esto a la URL de tu servidor

  constructor() {
    this.socket = io(this.uri);
  }

  // Método para escuchar el evento 'mensaje-event'
  onNotification(): Observable<string> {
    return new Observable<string>(observer => {
      this.socket.on('mensaje-event', (message: string) => {
        observer.next(message);
      });

      // Limpiar la suscripción cuando el observable se complete
      return () => this.socket.off('mensaje-event');
    });
  }

  // Método para emitir un evento 'nombre-paciente'
  sendNotification(message: string) {
    this.socket.emit('nombre-paciente', message);
  }

  // Puedes mantener este método o eliminarlo si solo usas onNotification
  mensajeEvent(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('mensaje-event', (data: any) => {
        observer.next(data);
      });

      // Limpiar la suscripción cuando el observable se complete
      return () => this.socket.off('mensaje-event');
    });
  }
}

