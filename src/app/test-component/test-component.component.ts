import { Component, OnInit } from '@angular/core';
import { TestServiceService } from './test-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

export interface Turnos {
  id?: number;
  fecha: string; // Fecha en formato ISO
  clienteId: number;
  userId: number;
}

@Component({
  standalone:true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  selector: 'app-test-component',
  templateUrl: './test-component.component.html',
  styleUrls: ['./test-component.component.css']
})
export class TestComponentComponent implements OnInit {

  turnos: Turnos[] = [];
  filteredTurnos: Turnos[] = [];

  constructor(private turnoService: TestServiceService) { }

  ngOnInit() {
    this.obtenerTurnos()
  }

  obtenerTurnos(): void {
    
    this.turnoService.obtenerTurno().subscribe({
      next: (turnos) => {
        this.turnos = turnos;
        this.filteredTurnos = turnos; // Inicialmente, muestra todos los turnos
        console.log('Estos son los turnos: ', this.turnos)
      },
      error: (error) => {
        console.error('Error al obtener turnos', error);
      }
    });
  }

  filterByMonth(event: Event): void {
    const input = event.target as HTMLInputElement;
    const month = input.value;

    if (month) {
      this.filteredTurnos = this.turnos.filter(turno => {
        const turnoDate = new Date(turno.fecha);
        const turnoMonth = turnoDate.toISOString().slice(0, 7);
        return turnoMonth === month;
      });
    } else {
      this.filteredTurnos = this.turnos;
    }
  }

  filterByWeek(event: Event): void {
    const input = event.target as HTMLInputElement;
    const week = input.value;

    if (week) {
      this.filteredTurnos = this.turnos.filter(turno => {
        const turnoDate = new Date(turno.fecha);
        const startOfWeek = this.getStartOfWeek(turnoDate);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        return turnoDate >= startOfWeek && turnoDate <= endOfWeek;
      });
    } else {
      this.filteredTurnos = this.turnos;
    }
  }

  filterByDay(event: Event): void {
    const input = event.target as HTMLInputElement;
    const day = input.value;

    if (day) {
      this.filteredTurnos = this.turnos.filter(turno => {
        const turnoDate = new Date(turno.fecha).toISOString().split('T')[0];
        return turnoDate === day;
      });
    } else {
      this.filteredTurnos = this.turnos;
    }
  }

  private getStartOfWeek(date: Date): Date {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    start.setDate(diff);
    return start;
  }

}
