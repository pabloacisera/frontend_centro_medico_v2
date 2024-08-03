import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../../../environment/development';

@Injectable({
  providedIn: 'root'
})
export class CorreosService {

  urlSendMail = environment.mailServiceUrl;
  urlGetUsers = environment.urlUsuario
  urlGetClients = environment.urlCliente

  constructor() { }

  sendMail(formData: FormData) {
    return axios.post(`${this.urlSendMail}/send`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data' // o applicaction/json
      }
    });
  }

  async getUserByExcept(id: number): Promise<any> {
    try {
      const res = await axios.get(`${this.urlGetUsers}/agend/${id}`);
      return res.data;
    } catch (error) {
      console.error('Error de axios:', error);
      throw new Error('Error al obtener usuarios.');
    }
  }
  

  async getClientByAgend(userId: number): Promise<any> {
    try {
      const res = await axios.get(`${this.urlGetClients}?userId=${userId}`);
      return res.data;
    } catch (error) {
      console.error('Error de axios:', error);
      throw new Error('Error al obtener clientes.');
    }
  }
  
}


