import { Component, OnInit } from '@angular/core';
import { PerfilService } from '../perfi.service';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-nueva-indicacion',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './nueva-indicacion.component.html',
  styleUrl: './nueva-indicacion.component.css'
})
export class NuevaIndicacionComponent implements OnInit {
  nuevaIndicacionTitulo: string = '';
  nuevaIndicacionTexto: string = '';
  userId: number = 0;

  constructor(private readonly perfilService: PerfilService, private router: Router) { }

  ngOnInit(): void {
    this.lanzarFunciones()
  }

  lanzarFunciones(){
    this.obtenerIdUsuario();
  }

  obtenerIdUsuario(){
    const userData = localStorage.getItem('userData');

    if (userData) {
      const userDataObj = JSON.parse(userData);
      this.userId = userDataObj.id;
    }
  }

  async crearNuevaIndicacion() {
    if (this.nuevaIndicacionTitulo.trim() === '' || this.nuevaIndicacionTexto.trim() === '') {
      alert('Por favor, complete ambos campos para crear una nueva indicación.');
      return;
    }
  
    const nuevaIndicacion = {
      titulo: this.nuevaIndicacionTitulo,
      texto: this.nuevaIndicacionTexto,
      userId: this.userId,
    };
  
    try {
      const response = await this.perfilService.crearNuevaIndicacion(nuevaIndicacion);
      console.log('Respuesta del backend:', response);
      this.router.navigate(['/perfil']);
    } catch (error) {
      console.error('Error al crear la indicación:', error);
      throw error;
    }
  }

  volver(){
    this.router.navigate(['/perfil'])
  }
}
