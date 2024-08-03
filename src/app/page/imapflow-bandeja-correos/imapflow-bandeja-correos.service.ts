import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/development';

export interface Email {
  seqno: number;
  headers: {
    from: string[];
    date: string[];
    subject: string[];
    to: string[];
  };
  body: string;
}

export interface EmailsResponse {
  emails: Email[];
}

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private apiUrl = environment.apiBaseUrl; // Reemplaza con la URL de tu backend

  constructor(private http: HttpClient) {}

  getEmails(): Observable<EmailsResponse> {
    return this.http.get<EmailsResponse>(`${this.apiUrl}/imap/fetch-emails`); // Ajusta la ruta según tu backend
  }
}

