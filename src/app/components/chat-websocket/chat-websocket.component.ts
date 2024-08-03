import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { io, Socket } from 'socket.io-client';

@Component({
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  selector: 'app-chat-websocket',
  templateUrl: './chat-websocket.component.html',
  styleUrls: ['./chat-websocket.component.css']
})
export class ChatWebsocketComponent implements OnInit, OnDestroy {

  @ViewChild('chatContainer') private chatContainer: ElementRef;

  public nombre: string = '';
  public id: string = '';
  private socket: Socket | undefined;
  status: boolean = false;
  connectedUsers: any[] = [];
  mensajes: { nombre: string, mensaje: string }[] = [];
  mensajeInput: string = '';
  private audio: HTMLAudioElement;
  private currentRoute: string = '';

  constructor(
    private toastr: ToastrService,
    private router: Router
  ) {
    this.audio = new Audio('assets/whatsapp-campana.mp3');
  }

  ngOnInit() {
    this.recolectarMetodos();
    this.monitorizarRuta();
  }

  ngOnDestroy() {
    this.desconectar(); // Asegúrate de desconectar al destruir el componente
  }

  recolectarMetodos() {
    this.obtenerNombreDesdeLocalStorage();
    this.escucharEventoDeInicioDeChat();
    this.recibirMensaje();
  }

  obtenerNombreDesdeLocalStorage() {
    const data = localStorage.getItem('userData');
    if (data) {
      const userData = JSON.parse(data);
      this.nombre = userData.nombre;
      this.id = userData.id;
      this.conectarSocket();
    }
  }

  conectarSocket() {
    this.socket = io('https://backend-centro-medico-chat.onrender.com', {
      query: { nombre: this.nombre, id: this.id },
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      console.log('Conectado con el nombre:', this.nombre);
      this.status = true;
    });
  }

  desconectar() {
    if (this.socket) {
      this.socket.disconnect();
      this.status = false;
      console.log('Desconectado del servidor de sockets');
    }
  }

  enviarMensaje(mensaje: string) {
    if (this.socket && mensaje.trim()) {
      this.socket.emit('enviar-mensaje', { nombre: this.nombre, id: this.id, mensaje });
      console.log('Mensaje enviado:', mensaje);
      this.mensajeInput = '';
    } else {
      console.log('El socket no está conectado o el mensaje está vacío.');
    }
  }

  escucharEventoDeInicioDeChat() {
    this.socket?.on('on-clientes-changed', (data) => {
      console.log('Listado de clientes: ', data);
      this.connectedUsers = data;
    });
  }

  recibirMensaje() {
    this.socket?.on('on-message', (data) => {
      console.log('Mensaje recibido:', data);
      this.mensajes.push({ nombre: data.nombre, mensaje: typeof data.mensaje === 'string' ? data.mensaje : JSON.stringify(data.mensaje) });
      this.audio.play().catch(error => {
        console.error('Error al reproducir el sonido:', error);
      });

      if (this.router.url !== '/chat') {
        this.toastr.info(`Nuevo mensaje de ${data.nombre}`, 'Nuevo Mensaje');
      }
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  toggleConnection() {
    if (this.status) {
      this.desconectar();
    } else {
      this.conectarSocket();
      this.status = true;
    }
  }

  private scrollToBottom(): void {
    const container = this.chatContainer.nativeElement;
    container.scrollTop = container.scrollHeight;
  }

  private monitorizarRuta() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;
      }
    });
  }
}
