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

  onNotification(): Observable<string> {
    return new Observable<string>(observer => {
      this.socket.on('mensaje-event', (message: string) => {
        observer.next(message);
      });
    });
  }

  sendNotification(message: string) {
    this.socket.emit('nombre-paciente', message);
  }
}

