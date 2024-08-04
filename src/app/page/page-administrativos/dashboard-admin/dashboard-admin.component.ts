import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ChatComponent } from '../../../components/chat-desplegable/chat-desplegable.component';


@Component({
  standalone: true,
  imports: [RouterLink, ChatComponent],
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css']
})
export class DashboardAdminComponent implements OnInit {

  constructor(private route: Router) { }

  ngOnInit() {
  }

  enrutarAFicha(){
    this.route.navigate(['/admin-nuevo-pac'])
  }

  enrutarAturno(){
    this.route.navigate(['/admin-turno'])
  }

  enrutarASalida(){
    localStorage.removeItem('userData')
    this.route.navigate(['/home'])
  }

  enrutarAUpload(){
    this.route.navigate(['/upload-file'])
  }

  enrutarABandeja(){
    this.route.navigate(['/bandeja-correo'])
  }

  enrutarAVerTurno() {
    this.route.navigate(['/ver-turnos-admin'])
  }
}
