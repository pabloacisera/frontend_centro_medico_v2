import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { ChatComponent } from '../../components/chat-desplegable/chat-desplegable.component';


@Component({
  selector: 'app-dashboard-profesional',
  standalone: true,
  imports: [RouterLink, ChatComponent, CommonModule],
  providers: [ToastrService],
  templateUrl: './dashboard-profesional.component.html',
  styleUrls: ['./dashboard-profesional.component.css']
})
export class DashboardProfesionalComponent implements OnInit {

  userId: number = 0;

  constructor(private Toastr: ToastrService, private route: Router) { }

  ngOnInit(): void {
    this.obtenerIdUsuario();
  }

  obtenerIdUsuario() {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const userDataObj = JSON.parse(userData);
      this.userId = userDataObj.id;
    }
  }

  salir() {
    localStorage.removeItem('Id de cliente');
    localStorage.removeItem('Id de usuario');
    localStorage.removeItem('userData');
    localStorage.removeItem('token');
    localStorage.removeItem('valorUB');
    localStorage.removeItem('valorUnitario');
    this.route.navigate(['/home']);
  }
}

