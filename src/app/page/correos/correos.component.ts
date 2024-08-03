import { Component, OnInit } from '@angular/core';
import { CorreosService } from './correos.service';
import { FormsModule, NumberValueAccessor } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AgendaPipeCliente } from './agenda.pipe';
import { AgendaUsuariosPipe } from './agenda-usuarios.pipe';
import { ButtonModule } from 'primeng/button';

@Component({
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule, AgendaPipeCliente, AgendaUsuariosPipe, ButtonModule],
  selector: 'app-correos',
  templateUrl: './correos.component.html',
  styleUrls: ['./correos.component.css']
})
export class CorreosComponent implements OnInit {
  from: string = 'software.medilink.business@gmail.com';
  to = '';
  subject = '';
  text = ''; // text debe ser una cadena vacía
  file: File | null = null;
  public isLoading = false;
  public message: string | null = null;
  public userId: number = 0;

  /**guardar datos de clientes y de usuarios */
  public cliente = [];
  public usuario = [];

  /**filtrado y paginacion clientes */
  public page: number = 0;
  text_cliente_search: string = '';

  onClienteSearch(search: string) {
    this.text_cliente_search = search;
  }

  paginaAnterior() {
    if (this.page > 0) {
      this.page -= 5;
    }
  }

  paginaSiguiente() {
    if ((this.page + 5) < this.cliente.length) {
      this.page += 5;
    }
  }

  /**filtrado y paginacion usuarios */
  public userPage: number = 0;
  public text_profesional_search: string = '';

  onProfesionalSearch(search: string) {
    this.text_profesional_search = search;
  }

  paginaUserAnterior() {
    if (this.userPage > 0) {
      this.userPage -= 5;
    }
  }

  paginaUserSiguiente() {
    if ((this.userPage + 5) < this.usuario.length) {
      this.userPage += 5;
    }
  }

  /**obtener email de las listas */
  copyToClipboardClient(textClient: string) {
    navigator.clipboard.writeText(textClient).then(() => {
      alert('Agregar texto copiado al formulario: ' + textClient);
      this.to = textClient;
    }).catch(err => {
      console.error('Error al copiar el texto: ', err);
    });
  }

  copyToClipboardUser(textUser: string) {
    navigator.clipboard.writeText(textUser).then(() => {
      alert('Agregar texto copiado al formulario: ' + textUser);
      this.to = textUser;
    }).catch(err => {
      console.error('Error al copiar el texto: ', err);
    });
  }

  constructor(private mailService: CorreosService, private route: Router) { }

  ngOnInit() {
    this.recolectarMetodos();
  }

  recolectarMetodos() {
    this.extraerDatosLocalStorage();
    this.obtenerUsuarios(this.userId);
    this.obtenerClientes(this.userId);
  }

  extraerDatosLocalStorage() {
    const user = localStorage.getItem('userData');
    if (user) {
      // Parsea el JSON para obtener el objeto y luego accede al id
      const parsedUser = JSON.parse(user);
      this.userId = parsedUser.id;
      console.log('Id de usuario: ', this.userId);
    }
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
    }
  }

  sendMail() {
    this.isLoading = true;
    const formData = new FormData();
    formData.append('from', this.from);
    formData.append('to', this.to);
    formData.append('subject', this.subject);
    formData.append('text', this.text);
    if (this.file) {
      formData.append('file', this.file, this.file.name);
    }

    this.mailService.sendMail(formData)
      .then(response => {
        console.log('Correo enviado: ', response);
        this.message = 'El correo se ha enviado correctamente.';
      })
      .catch(error => {
        console.error('Error al enviar el correo: ', error);
        this.message = 'No se ha podido enviar el correo.';
      })
      .finally(() => {
        this.isLoading = false;
        setTimeout(() => {
          this.message = null;
          this.route.navigate(['/dash-prof']);
        }, 3000);
      });
  }

  /**obtener usuarios*********************************************************/
  async obtenerUsuarios(userId: number) {
    try {
      const response = await this.mailService.getUserByExcept(userId);
      console.log('Respuesta del servidor de usuario:', response);
      this.usuario = response;
    } catch (error) {
      console.log('Error al obtener usuarios:', error);
    }
  }

  async obtenerClientes(userId: number) {
    try {
      const response = await this.mailService.getClientByAgend(userId);
      console.log('Respuesta del servidor de cliente:', response);
      this.cliente = response;
    } catch (error) {
      console.log('Error al obtener clientes:', error);
    }
  }
}
