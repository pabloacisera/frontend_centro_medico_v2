import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor(private ruta: Router){}
  enrutarProfesional(){
    this.ruta.navigate(['/logear'])
  }

  enrutarPacientes(){
    this.ruta.navigate(['/logear-paciente'])
  }

  enrutarAdmin(){
    this.ruta.navigate(['/logear-admin'])
  }
}
