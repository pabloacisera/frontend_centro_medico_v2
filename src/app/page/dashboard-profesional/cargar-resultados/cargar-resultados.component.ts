import { Component } from '@angular/core';
import { NomenclaturaService } from '../buscar-nomenclatura/nomenclatura.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ListadoPacientesService } from '../listado-pacientes/listado-pacientes.service';
import { Nomenclatura } from './resultado.interface';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { ToastrService } from 'ngx-toastr';
import { ResultadosService } from './resultado.service';

@Component({
  selector: 'app-cargar-resultados',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgxPaginationModule, RouterLink],
  templateUrl: './cargar-resultados.component.html',
  styleUrl: './cargar-resultados.component.css'
})
export class CargarResultadosComponent {
  userId!: number;
  datosDeCliente: any[] = [];
  loader = false;
  clienteSeleccionado: any;
  searchText = '';
  filteredData: any[] = [];
  searchForm: FormGroup;
  resultMessage = '';
  nomenclaturas: Nomenclatura[] = [];
  showResult = false;
  clienteId: number = 0
  p: number = 1
  resultados: any[] = []; 
  isLoading: boolean = false;
  valorSumar: number = 0
  valorUB: number = 0
  botonTexto: string = 'Guardar';

  constructor(
    private readonly servicio: ListadoPacientesService,
    private formBuilder: FormBuilder,
    private nomenclaturaService: NomenclaturaService,
    private resultService: ResultadosService,
    private ruta: Router,
    private toastr: ToastrService,
  ) {
    this.searchForm = this.formBuilder.group({
      codigo: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.recolectarFunciones()
  }


  recolectarFunciones(){
    this.extraerValorDeUb()
    this.extraerValorDeUsuario()
  }

  extraerValorDeUb(){
    const storedValue = localStorage.getItem('valorUnitario');
    if (storedValue) {
      this.valor_unitario = parseFloat(storedValue);
      this.botonTexto = 'Actualizar';
    }
  }

  extraerValorDeUsuario(){
    const userData = localStorage.getItem('userData');
    if (userData) {
      const userDataObj = JSON.parse(userData);
      this.userId = userDataObj.id;
      this.obtenerClientPorId(this.userId);
    } else {
      console.error('No se encontró userData en el localStorage');
    }
  }

  async obtenerClientPorId(userId: number): Promise<void> {
    try {
      this.loader = true;
      const response = await this.servicio.obtenerClientesById(userId);
      this.datosDeCliente = response;
      this.filteredData = this.filterData(); // Actualizamos el filtro de datos
    } catch (error) {
      console.error('No se ha podido obtener datos de clientes: ', error);
    } finally {
      this.loader = false;
    }
  }

  funcionSeleccionar(item: any) {
    this.clienteSeleccionado = item;
    this.clienteId = item.id;
  }

  filterData(): any[] {
    if (!this.searchText) {
      return this.datosDeCliente;
    }
    const lowerCaseSearch = this.searchText.toLowerCase();
    return this.datosDeCliente.filter(item =>
      (item.protocolo && item.protocolo.toString().toLowerCase().includes(lowerCaseSearch)) ||
      (item.nombre && item.nombre.toString().toLowerCase().includes(lowerCaseSearch))
    );
  }

  onSearchTextChange(): void {
    this.filteredData = this.filterData();
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
          const nuevaNomenclatura: Nomenclatura = {
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

  /*****************************************************/
  valor_unitario: number = 0;

  obtenerValor(valor: string): void {
    this.valor_unitario = parseFloat(valor);
    localStorage.setItem('valorUnitario', valor);
    console.log(this.valor_unitario);
    this.botonTexto = 'Actualizar';
  }


  valor_resultado: number = 0;

  actualizarValoresTotales() {
    for (let nomenclatura of this.nomenclaturas) {
      nomenclatura.valorTotal = this.calcularValorTotal(nomenclatura.unidadBase);
    }
  }

  calcularValorTotal(unidadBase: number): number {
    return this.valor_unitario * unidadBase;
  }

  guardarResultado(nomenclatura: Nomenclatura, resultado: string) {
    nomenclatura.resultado = parseFloat(resultado);
    console.log('Guardar resultado:', nomenclatura);
  }

  guardarResultados() {
    console.log('Todos los datos a enviar al backend:');
    for (let nomenclatura of this.nomenclaturas) {
      console.log(nomenclatura);
      this.guardarResultado(nomenclatura, nomenclatura.resultado.toString());
    }
    this.resultService.guardarResultados(this.nomenclaturas)
      .then(() => {
        console.log('Todos los resultados han sido enviados al backend.');
        
        this.toastr.success(`Se han agreagdo ${this.nomenclaturas.length} resultados a la base de datos`, 'Actualizacion de estado:')

        this.ruta.navigate([`/ver/${this.clienteId}`])
      })
      .catch(error => {
        console.error('Error al enviar resultados al backend:', error)
      });
  }

  /**********************************/

  sumarValorTotal(){
    this.valorSumar = this.resultados.reduce((acc, item)=> acc + item.valorTotal, 0)
  }

  async obtenerResultados(clienteId?: number) {
    try {
      this.isLoading = true;
      this.resultados = await this.resultService.findAllResultados(clienteId);
      console.log('Resutlados por id',this.resultados)
      this.sumarValorTotal();
      this.isLoading = false;
    } catch (error) {
      console.error('Error obteniendo resultados:', error);
      // Manejar el error según sea necesario (por ejemplo, mostrar un mensaje de error en la UI)
      this.isLoading = false;
    }
  }

  async eliminarResultadoPorId(id:number){
    console.log('Este es el id del resultado a borrrar',id)
    this.resultService.eliminarResultadoPorId(id)
      .then((resonse)=>{
        console.log('resultado eliminado')
        this.obtenerResultados(this.clienteId)
      })
      .catch((error)=>{
        throw new Error('No se ha podido borrar resultado: ', error)
      })
  }
}
