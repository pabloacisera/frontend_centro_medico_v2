import { Component, OnInit } from '@angular/core';
import { NotificationService } from './notificacion-global.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-aviso-presencia',
  templateUrl: './aviso-presencia.component.html',
  styleUrls: ['./aviso-presencia.component.css']
})
export class AvisoPresenciaComponent implements OnInit {
  message: string = '';
  visible: boolean = false;
  private audio = new Audio('assets/check-mark_oPG7Xo5.mp3');

  constructor(private notificationService: NotificationService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.notificationService.getNotification().subscribe(message => {
      this.showMessage(message);
    });
  }

  showMessage(message: string) {
    this.message = message;
    this.visible = true;
    this.playSound();
    this.toastr.success(this.message, 'Presencia Confirmada', {
      timeOut: 5000,
      positionClass: 'toast-bottom-right'
    });
    setTimeout(() => {
      this.visible = false;
    }, 10000);
  }

  playSound() {
    this.audio.play();
  }
}


