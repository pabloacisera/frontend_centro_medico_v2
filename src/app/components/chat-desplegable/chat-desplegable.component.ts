import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { io, Socket } from 'socket.io-client';

@Component({
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  selector: 'app-chat',
  templateUrl: './chat-desplegable.component.html',
  styleUrls: ['./chat-desplegable.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {

  @ViewChild('chatContainer') private chatContainer: ElementRef;

  public nombre: string = '';
  public id: string = '';
  private socket: Socket | undefined;
  status: boolean = false;
  isChatOpen: boolean = false;
  connectedUsers: any[] = [];
  mensajes: { nombre: string, mensaje: string }[] = [];
  mensajeInput: string = '';
  private audio: HTMLAudioElement;
  private currentRoute: string = '';

  constructor(
    private toastr: ToastrService,
    private router: Router,
    private cdr: ChangeDetectorRef // Añadido para forzar la detección de cambios
  ) {
    this.audio = new Audio('assets/whatsapp-campana.mp3');
  }

  ngOnInit() {
    this.obtenerNombreDesdeLocalStorage();
    this.monitorizarRuta();
  }

  ngOnDestroy() {
    this.desconectar();
  }

  obtenerNombreDesdeLocalStorage() {
    const data = localStorage.getItem('userData');
    if (data) {
      const userData = JSON.parse(data);
      this.nombre = userData.nombre;
      this.id = userData.id;
      if (this.isChatOpen) {
        this.conectarSocket();
      }
    }
  } 

  conectarSocket() {
    if (this.socket) {
      this.desconectar();
    }
    
    this.socket = io('https://backend-centro-medico-chat.onrender.com', {
      query: { nombre: this.nombre, id: this.id },
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      console.log('Conectado con el nombre:', this.nombre);
      this.status = true;
    });

    this.socket.on('disconnect', () => {
      console.log('Desconectado del servidor de sockets');
      this.status = false;
    });

    this.escucharEventoDeInicioDeChat();
    this.recibirMensaje();
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

      // Forzar la detección de cambios para actualizar la vista
      this.cdr.detectChanges();

      // Desplazarse hacia el fondo del chat después de recibir el mensaje
      this.scrollToBottom();

      this.audio.play().catch(error => {
        console.error('Error al reproducir el sonido:', error);
      });

      if (this.router.url !== '/chat') {
        this.toastr.info(`Nuevo mensaje de ${data.nombre}`, 'Nuevo Mensaje');
      }
    });
  }

  private scrollToBottom(): void {
    if (this.chatContainer && this.chatContainer.nativeElement) {
      const container = this.chatContainer.nativeElement;
      container.scrollTop = container.scrollHeight;
    }
  }

  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
    if (this.isChatOpen) {
      this.conectarSocket();
    } else {
      this.desconectar();
    }
  }

  closeChat() {
    this.isChatOpen = false;
    this.desconectar();
  }

  private monitorizarRuta() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;
      }
    });
  }
}











