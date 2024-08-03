import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Email, EmailService } from './imapflow-bandeja-correos.service';
import { CleanEmailBodyPipe } from '../../clean-email-body.pipe';
import { FechaBandejaEmailPipe } from './fecha-bandeja-email.pipe';
import { RouterLink } from '@angular/router';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ButtonModule } from 'primeng/button';

@Component({
  standalone: true,
  imports: [CommonModule, FechaBandejaEmailPipe, CleanEmailBodyPipe, RouterLink, ProgressSpinnerModule, ButtonModule],
  selector: 'app-imapflow-bandeja-correos',
  templateUrl: './imapflow-bandeja-correos.component.html',
  styleUrls: ['./imapflow-bandeja-correos.component.css']
})
export class ImapflowBandejaCorreosComponent implements OnInit {

  emails: Email[] = [];
  selectedEmail: Email | null = null;
  decodedBody: string = '';
  noEmailsMessage: string = ''; // Variable para el mensaje de "no hay correos"
  loading: boolean = false;

  constructor(private emailService: EmailService) {}

  ngOnInit(): void {
    this.obtenerMails()
  }

  obtenerMails(): void {
    this.loading= true;
    this.emailService.getEmails().subscribe(
      (data) => {
        console.log('Emails fetched:', data); // Verifica la estructura aquí
        if (Array.isArray(data.emails)) {
          this.emails = data.emails;
          this.noEmailsMessage = this.emails.length === 0 ? 'No hay correos nuevos' : ''; // Establece el mensaje si no hay correos
        } else {
          console.error('Emails property is not an array:', data.emails);
        } 
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching emails:', error);
        this.loading = false;
      }
    );
  }

  selectEmail(email: Email): void {
    this.selectedEmail = email;
    console.log('Selected email:', email);
    this.decodedBody = this.decodeEmailBody(email.body);
    console.log('Decoded body:', this.decodedBody);
  }

  decodeEmailBody(body: string): string {
    try {
      console.log('Raw body:', body);

      // Usa el pipe para limpiar el cuerpo del email
      return new CleanEmailBodyPipe().transform(body);
    } catch (error) {
      console.error('Unexpected error during decoding:', error);
      return 'Error decoding email body';
    }
  }

  refreshTable(): void {
    this.loading = true;
    this.selectedEmail = null;
    this.obtenerMails()

  }
    
}
