import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LogeoProfesionalService } from './logeoProfesional.service';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-logeo',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './logeo.component.html',
  styleUrl: './logeo.component.css'
})
export class LogeoComponent {
  public datosDeLogeo!: any;

  formularioDeLogeo!: FormGroup;

  constructor(private fb: FormBuilder, private peticion: LogeoProfesionalService, private ruta: Router) { // Se corrigió el constructor y se inicializó correctamente el FormBuilder
    this.formularioDeLogeo = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.minLength(6)], // Aquí deberías usar Validators.minLength(6) para validar la longitud mínima del campo
    });
  }
  ngOnInit(): void {

  }

  async onSubmit() {
    if (this.formularioDeLogeo.valid) {
      const data = this.formularioDeLogeo.value;
      this.peticion.registrar(data)
        .pipe(
          catchError(error => {
            console.error('Error al registrar usuario:', error);
            throw error; // Lanza el error para ser manejado por el componente
          })
        )
        .subscribe(response => {
          // Guardar token y datos de usuario en localStorage
          localStorage.setItem('token', response.token);
          localStorage.setItem('userData', JSON.stringify(response.data));
          console.log('Usuario logeado exitosamente:', response.data);
          this.ruta.navigate(['/dash-prof']);
          // Aquí podrías manejar la respuesta exitosa como lo necesites
        });
    }
  }
}
