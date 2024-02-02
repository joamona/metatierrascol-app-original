import { Component } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatRadioModule} from "@angular/material/radio";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {DatosPredio, LC_PredioTipo, SectorPredio} from "../../models/datosPredio.model";
import {DatosPredioService} from "../../services/DatosPredioService";
import {PredioService} from "../../services/PredioService";
import {MatSelectModule} from "@angular/material/select";
import {DataService} from "../../services/DataService";
import {Departamento, Municipio, Provincia} from "../../models/propietario.model";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {MatButtonModule} from "@angular/material/button";
import {MatSnackBar} from "@angular/material/snack-bar";

import { municipios } from 'src/app/utilities/listas/listaMunicipios';
import { provincias } from 'src/app/utilities/listas/listaProvincias';
import { departamentos } from 'src/app/utilities/listas/listaDepartamentos';
import { AlphabeticalOrderPipe } from 'src/app/pipes/alphabetical-order.pipe';

@Component({
  selector: 'app-datos-predio',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    RouterLink,
    MatSelectModule,
    ReactiveFormsModule,
    MatButtonModule,
    AlphabeticalOrderPipe
  ],
  templateUrl: './datos-predio.component.html',
  styleUrl: './datos-predio.component.css'
})
export class DatosPredioComponent {
  datosPredioForm: FormGroup;
  array_LC_PredioTipo = Object.values(LC_PredioTipo);
  nombre: string = '';
  sectorPredio: SectorPredio = SectorPredio.Norte;
  departamentos: Departamento[] = departamentos;
  provincias: Provincia[] = provincias;
  municipios: Municipio[]  = municipios;
  municipiosFiltrados: Municipio[] = [];
  provinciasFiltradas: Provincia[] = [];
  departamentoSeleccionado: string = '';
  provinciaSeleccionada: string = '';
  municipioSeleccionado: string = '';
  vereda: string = '';
  numeroPredial: string = '';
  numero_catastral:string='';
  latitud:string='';
  longitud:string='';
  tipo: LC_PredioTipo = LC_PredioTipo.Baldio;
  complemento: string = '';

  titulo: string =  "Datos del Predio ";
  predioActual = this.predioService.obtenerPredioActual();

  constructor(private datosPredioService: DatosPredioService, private router: Router, private dataService: DataService, private predioService: PredioService, private route: ActivatedRoute, private snackBar: MatSnackBar) {
    this.datosPredioForm = new FormGroup({
      nombre: new FormControl('', Validators.required),
      sectorPredio: new FormControl('', Validators.required),
      departamentoSeleccionado: new FormControl('', Validators.required),
      provinciaSeleccionada: new FormControl('', Validators.required),
      municipioSeleccionado: new FormControl('', Validators.required),
      vereda: new FormControl('', Validators.required),
      numeroPredial: new FormControl(''), // Opcional, sin validadores
      numero_catastral: new FormControl(''),
      longitud:new FormControl(''),
      latitud: new FormControl(''),
      tipo: new FormControl('', Validators.required),
      complemento: new FormControl('', Validators.required)
    });
  }


  ngOnInit() {
    this.route.params.subscribe(params => {
      const predioId = +params['id'];
      // this.cargarDepartamentosYMunicipios().then(() => {
      //   this.cargarDatosDelPredio(predioId);
      // });
      
      this.cargarDatosDelPredio(predioId);
      
    });
  }



  cargarDepartamentosYMunicipios(): Promise<void> {
    const departamentosPromise = this.dataService.getDepartamentos().toPromise().then(data => {
      this.departamentos = data || [];
    });

    const municipiosPromise = this.dataService.getMunicipios().toPromise().then(data => {
      this.municipios = data || [];
    });

    const provinciasPromise = this.dataService.getProvincias().toPromise().then(data => {
      this.provincias = data || [];
    });

    return Promise.all([departamentosPromise, municipiosPromise, provinciasPromise]).then(() => {});
  }

  cargarDatosDelPredio(predioId: number) {
    // Intenta encontrar el predio en la lista guardada primero
    const predioEncontrado = this.predioService.getListaPredios().find(predio => predio.id === predioId);

    // Si no se encuentra, usa el predio actual
    if (!predioEncontrado) {
      this.predioActual = this.predioService.obtenerPredioActual();
    } else {
      this.predioActual = predioEncontrado;
    }

    if (this.predioActual) {
      if (this.predioActual.datosPredio) {
        this.inicializarFormularioConDatos(this.predioActual.datosPredio);
      } else {
        console.error('Predio no encontrado con ID:', predioId);
      }
    } else {
      console.error('Predio no encontrado con ID:', predioId);
    }

    this.onDepartamentoChange();
  }



  inicializarFormularioConDatos(datosPredio: DatosPredio) {
    this.datosPredioForm.patchValue({
      nombre: datosPredio.nombre,
      sectorPredio: datosPredio.sectorPredio,
      departamentoSeleccionado: datosPredio.departamento,
      provinciaSeleccionada: datosPredio.provincia,
      municipioSeleccionado: datosPredio.municipio,
      vereda: datosPredio.vereda,
      numeroPredial: datosPredio.numeroPredial,
      numero_catastral: datosPredio.numero_catastral,
      longitud: datosPredio.longitud,
      latitud: datosPredio.latitud,
      tipo: datosPredio.tipo,
      complemento: datosPredio.complemento
    });

    this.onDepartamentoChange();
  }
  onDepartamentoChange() {
    const deptoSeleccionado = this.datosPredioForm.get('departamentoSeleccionado')?.value;

    // Filtra municipios basados en el departamento seleccionado
    this.municipiosFiltrados = this.municipios.filter(m => m.departamento === deptoSeleccionado);

    // Obtiene los nombres de las provincias correspondientes a los municipios filtrados
    const nombresProvinciasDeMunicipiosFiltrados = this.municipiosFiltrados.map(m => m.provincia);

    // Elimina duplicados de nombres de provincias
    const nombresProvinciasUnicas = nombresProvinciasDeMunicipiosFiltrados.filter((nombreProvincia, index, array) => array.indexOf(nombreProvincia) === index);

    // Filtra el arreglo completo de provincias basándonos en los nombres únicos
    this.provinciasFiltradas = this.provincias.filter(provincia => nombresProvinciasUnicas.includes(provincia.provincia));

    // Restablece el municipio y la provincia seleccionada si no están en las listas filtradas
    if (!this.municipiosFiltrados.some(m => m.nombre_municipio === this.municipioSeleccionado)) {
      this.datosPredioForm.get('municipioSeleccionado')?.setValue('');
    }
    if (!this.provinciasFiltradas.some(p => p.provincia === this.provinciaSeleccionada)) {
      this.datosPredioForm.get('provinciaSeleccionada')?.setValue('');
    }
  }



  guardarDatos() {
    if (this.datosPredioForm.valid) {
      const datosPredio = new DatosPredio(
        this.datosPredioForm.value.nombre,
        this.datosPredioForm.value.departamentoSeleccionado,
        this.datosPredioForm.value.provinciaSeleccionada,
        this.datosPredioForm.value.sectorPredio,
        this.datosPredioForm.value.municipioSeleccionado,
        this.datosPredioForm.value.vereda,
        this.datosPredioForm.value.numeroPredial,
        this.datosPredioForm.value.numero_catastral,
        this.datosPredioForm.value.tipo,
        this.datosPredioForm.value.complemento,
        this.datosPredioForm.value.longitud,
        this.datosPredioForm.value.latitud
      );

      this.predioActual.datosPredio = datosPredio;
      this.datosPredioService.addDatosPredio(datosPredio);

      console.log(this.datosPredioService.getDatosPredio());
      console.log(this.predioActual);
      this.snackBar.open('Datos del predio guardados con éxito', 'Cerrar', { duration: 3000 });

      this.router.navigate(['/nuevo-predio/' , this.predioActual.id])
    } else {
      this.snackBar.open('Por favor, completa todos los campos requeridos', 'Cerrar', { duration: 3000 });
    }
  }

}
