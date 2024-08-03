import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { VerPacienteService } from './ver.service';
import { ResultadosService } from '../../cargar-resultados/resultado.service';
import { DateFormatPipe } from '../../../../date-format.pipe';
import { CommonModule } from '@angular/common';
import { Crear_pdfService } from './crear_pdf.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-ver',
  standalone: true,
  imports: [CommonModule, DateFormatPipe, RouterLink, ProgressSpinnerModule],
  templateUrl: './ver.component.html',
  styleUrl: './ver.component.css'
})
export class VerComponent {
  userId!: number
  clienteId!: number
  datosDeCliente: any = {}
  resultados: any[] = []
  isLoading: boolean = false
  valorSumar: number = 0
  userData: any = {}

  constructor(
    private route: ActivatedRoute, 
    private peticion: VerPacienteService,
    private resultService: ResultadosService, 
    private pdfService: Crear_pdfService
  ) { }

  ngOnInit(): void {
    this.recolectarDatos();
  }

  obtenerDatosUsuario() {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const userDataObj = JSON.parse(userData);
      this.userData = userDataObj;
      console.log('Datos de usuario: ', this.userData);
      this.userId = userDataObj.id;
      console.log('Id del usuario: ', this.userId);
    } else {
      console.error('No se encontraron datos de usuario en localStorage.');
    }
  }

  obtenerDatosCliente() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.clienteId = parseInt(idParam, 10);
      console.log('Id del cliente: ', this.clienteId);
    }
  }

  recolectarDatos() {
    this.obtenerDatosUsuario();
    this.obtenerDatosCliente();
    this.obtenerClientePorUserId(this.clienteId)
    this.obtenerResultados(this.clienteId)
  }

  async obtenerClientePorUserId(clienteId: number) {
    try {
      this.isLoading = true;
      const response = await this.peticion.encontrarClienteByUserId(clienteId);
      console.log('Response:', response);
      this.datosDeCliente = response; // Asignamos la respuesta al objeto datosDeCliente
      this.isLoading = false;
    } catch (error) {
      console.error('Error en .ts: ', error);
      this.isLoading = false;
    }
  }

  sumarValorTotal() {
    this.valorSumar = this.resultados.reduce((acc, item) => acc + item.valorTotal, 0)
  }

  async obtenerResultados(clienteId?: number) {
    try {
      this.isLoading = true;
      this.resultados = await this.resultService.findAllResultados(clienteId);
      console.log('Resutlados por id', this.resultados)
      this.sumarValorTotal();
      this.isLoading = false;
    } catch (error) {
      console.error('Error obteniendo resultados:', error);
      // Manejar el error según sea necesario (por ejemplo, mostrar un mensaje de error en la UI)
      this.isLoading = false;
    }
  }

  async eliminarResultadoPorId(id: number) {
    console.log('Este es el id del resultado a borrrar', id)
    this.peticion.eliminarResultadoPorId(id)
      .then((resonse) => {
        console.log('resultado eliminado')
        this.obtenerResultados(this.clienteId)
      })
      .catch((error) => {
        throw new Error('No se ha podido borrar resultado: ', error)
      })
  }

  /*********creacion de pdf********************* */

  downloadPdf() {
    // Verifica que estás pasando los parámetros en el orden correcto
    this.pdfService.generatePdf(this.datosDeCliente, this.resultados, this.valorSumar, this.userData);
  }  
}
