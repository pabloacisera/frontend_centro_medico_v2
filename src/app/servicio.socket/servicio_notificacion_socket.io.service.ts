import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class Servicio_notificacion_socketioService {
  private socket: Socket
  private toastr: ToastrService

  constructor() {
    this.socket = io('https://backend-centro-medico-4.onrender.com',
      {
        transports: [ 'websocket' ]
      }
    )

    this.socket.on('connection', ()=> {
      console.log('connected to socket')
    })
  }

  notifyPresence(nombreCliente: string) {
    this.socket.emit('message', { nombreCliente });
  }

  getNotifications(): Observable<string> {
    return new Observable<string>((observer) => {
      this.socket.on('notification', (data: { nombreCliente: string }) => {
        observer.next(data.nombreCliente);
      });
    });
  }
}
