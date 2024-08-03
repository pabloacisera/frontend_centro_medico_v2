import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NomenclaturaService } from '../../buscar-nomenclatura/nomenclatura.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ResultadosService } from '../../cargar-resultados/resultado.service';
import { CargarService } from './cagar.service';

@Component({
  selector: 'app-cargar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './cargar.component.html',
  styleUrl: './cargar.component.css'
})
export class CargarComponent {
  clienteId: number = 0;
  datosDeCliente: any = {};
  userId: number = 0;
  searchForm: FormGroup;
  resultMessage = '';
  nomenclaturas: any[] = [];
  showResult = false;
  resultados: any[] = [];
  isLoading: boolean = false;
  valorSumar: number = 0;
  valor_unitario: number = 0;
  boton_actualizar: boolean = false;

  constructor(
    private readonly route: ActivatedRoute,
    private nomenclaturaService: NomenclaturaService,
    private resultadoService: ResultadosService,
    private resultService: CargarService,
    private fb: FormBuilder,
    private ruta: Router,
    private toastr: ToastrService
  ) {
    this.searchForm = this.fb.group({
      codigo: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.recolectarFunciones();
  }

  recolectarFunciones() {
    this.extraerValorDeLocalStorage()
    this.obtenerDatosUsuario();
    this.obtenerDatosCliente();
    this.obtenerClientePorId(this.clienteId, this.userId);
    this.obtenerResultados(this.clienteId); // Asegúrate de llamar a obtenerResultados
  }

  obtenerDatosUsuario() {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const userDataObj = JSON.parse(userData);
      this.userId = userDataObj.id;
      console.log('Id del usuario: ', this.userId);
    }
  }

  obtenerDatosCliente() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.clienteId = parseInt(idParam, 10);
      console.log('Id del cliente: ', this.clienteId);
    }
  }

  async obtenerClientePorId(clienteId: number, userId: number) {
    try {
      const response = await this.resultService.encontrarClienteById(clienteId, userId);
      console.log('Response:', response);
      this.datosDeCliente = response; // Asignamos la respuesta al objeto datosDeCliente
      console.log('Datos guardados: ', this.datosDeCliente);
      console.log(typeof this.datosDeCliente);
    } catch (error) {
      console.error('Error en .ts: ', error);
    }
  }

  async obtenerResultados(clienteId: number) {
    try {
      this.isLoading = true;
      this.resultados = await this.resultService.findAllResultados(clienteId);
      console.log('Resultados por id:', this.resultados);
      this.isLoading = false;
    } catch (error) {
      console.error('Error obteniendo resultados:', error);
      this.isLoading = false;
    }
  }

  onSubmit(): void {
    if (this.searchForm.invalid) {
      return;
    }

    const codigo = this.searchForm.value.codigo;
    this.nomenclaturaService.buscarNomenByCodigo(codigo)
      .then((data) => {
        if (!data) {
          this.resultMessage = 'No existe código';
        } else {
          this.resultMessage = '';
          const nuevaNomenclatura = {
            codigo: data.codigo,
            determinacion: data.determinacion,
            resultado: 0,
            clienteId: this.clienteId, // Asignamos el clienteId aquí
            unidadBase: data.unidadBase,
            valorTotal: this.calcularValorTotal(data.unidadBase),
          };
          this.nomenclaturas.push(nuevaNomenclatura);
        }
        this.showResult = true;
        console.log(this.nomenclaturas.length); // Check the array length
      })
      .catch((error) => {
        console.error('Error al buscar por código:', error);
        this.resultMessage = 'Error al buscar por código';
        this.showResult = true;
      })
      .finally(() => {
        this.searchForm.reset();
      });
  }

  /********************************************* */

  obtenerValor(valor: string) {
    // Convertir el valor a número y guardarlo en la variable
    this.valor_unitario = parseFloat(valor);

    // Guardar el valor unitario en el almacenamiento local como cadena
    localStorage.setItem('valorUB', this.valor_unitario.toString());

    // Para verificar que el valor se guarda correctamente
    console.log(this.valor_unitario);
  }

  actualizarValoresTotales() {
    // Leer el valor unitario desde el almacenamiento local
    const valorGuardado = localStorage.getItem('valorUB');

    // Convertir el valor guardado a número
    if (valorGuardado) {
      this.valor_unitario = parseFloat(valorGuardado);
    } else {
      console.error('Valor unitario no encontrado en localStorage');
      return; // Si no hay valor guardado, salir del método
    }

    // Calcular y actualizar los valores totales
    for (let nomenclatura of this.nomenclaturas) {
      nomenclatura.valorTotal = this.calcularValorTotal(nomenclatura.unidadBase);
    }
  }

  calcularValorTotal(unidadBase: number): number {
    return this.valor_unitario * unidadBase;
  }

  extraerValorDeLocalStorage() {
    const valorExtraido = localStorage.getItem('valorUB');
    if (valorExtraido) {
      this.valor_unitario = parseFloat(valorExtraido);
      this.boton_actualizar = true;
    }
    console.log('Valor de unidad Base: ', valorExtraido);
  }

  


  /************************************************************ */

  guardarResultado(nomenclatura: any, resultado: string) {
    nomenclatura.resultado = parseFloat(resultado);
    console.log('Guardar resultado:', nomenclatura);
  }

  guardarResultados() {
    console.log('Todos los datos a enviar al backend:');
    for (let nomenclatura of this.nomenclaturas) {
      console.log(nomenclatura);
      this.guardarResultado(nomenclatura, nomenclatura.resultado.toString());
    }
    this.resultadoService.guardarResultados(this.nomenclaturas)
      .then(() => {
        console.log('Todos los resultados han sido enviados al backend.');

        this.toastr.success(`Se han agreagdo ${this.nomenclaturas.length} resultados a la base de datos`);

        this.ruta.navigate([`/ver/${this.clienteId}`]);
      })
      .catch(error => {
        console.error('Error al enviar resultados al backend:', error);
      });
  }

  async eliminarResultadoPorId(id: number) {
    console.log('Este es el id del resultado a borrar', id);
    try {
      await this.resultService.eliminarResultadoPorId(id);
      console.log('Resultado eliminado');
      this.obtenerResultados(this.clienteId);
    } catch (error) {
      console.error('No se ha podido borrar resultado:', error);
    }
  }
}