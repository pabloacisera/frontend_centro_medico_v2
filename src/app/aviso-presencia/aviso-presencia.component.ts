import { Component, OnInit } from '@angular/core';
import { SocketService } from '../../socket-Service/socket.service';
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

  constructor(private socketService: SocketService) { }

  ngOnInit(): void {
    this.socketService.onNotification().subscribe(message => {
      this.showMessage(message);
    });
  }

  showMessage(message: string) {
    this.message = message;
    this.visible = true;
    this.playSound();
    setTimeout(() => {
      this.visible = false;
    }, 10000);
  }

  playSound() {
    this.audio.play();
  }
}

