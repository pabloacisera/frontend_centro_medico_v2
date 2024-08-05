import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io('https://backend-centro-medico-4.onrender.com', {
      withCredentials: true
    });
  }

  enviarNotificacion(id: number): void {
    this.socket.emit('notificar-presencia', id);
  }

  recibirNotificacion(): Observable<number> {
    return new Observable((observer) => {
      this.socket.on('notificacion-presencia', (id: number) => {
        observer.next(id);
      });
    });
  }
}
