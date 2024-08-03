import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NotificationService } from './notificacion-global.service';

@Component({
  selector: 'app-aviso-presencia',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './aviso-presencia.component.html',
  styleUrl: './aviso-presencia.component.css'
})
export class AvisoPresenciaComponent implements OnInit {

  @Input() message: string = ''
  visible: boolean = false
  private audio = new Audio('assets/check-mark_oPG7Xo5.mp3')

  constructor( private readonly notificacionService: NotificationService) { }

  ngOnInit(): void {
    this.notificacionService.getNotification().subscribe(message => {
      this.showMessage(message);
    });
  }

  showMessage(message: string) {
    this.message = message
    this.visible = true
    this.playSound()
    setTimeout(()=> {
      this.visible = false
    }, 10000)
  }

  playSound(){
    this.audio.play()
  }
}
