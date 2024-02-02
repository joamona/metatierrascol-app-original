import { Component } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import { Propietario, CR_InteresadoTipo, CR_DocumentoTipo, CR_SexoTipo, Grupo_Etnico, Estado } from '../../../models/propietario.model';
import { PropietarioService } from '../../../services/PropietarioService';
import { PredioService } from '../../../services/PredioService';
import {MatRadioModule} from "@angular/material/radio";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import { DataService } from '../../../services/DataService';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {Departamento, Municipio} from "../../../models/propietario.model";
import {MatButtonModule} from "@angular/material/button";
import {MatSnackBar} from "@angular/material/snack-bar";

import { municipios } from 'src/app/utilities/listas/listaMunicipios';
import { provincias } from 'src/app/utilities/listas/listaProvincias';
import { departamentos } from 'src/app/utilities/listas/listaDepartamentos';
//pipes
import { AlphabeticalOrderPipe } from 'src/app/pipes/alphabetical-order.pipe';

@Component({
  selector: 'app-add-propietario',
  standalone: true,
  imports: [
    RouterLink,
    MatInputModule,
    FormsModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatButtonModule,
    AlphabeticalOrderPipe
  ],
  templateUrl: './add-propietario.component.html',
  styleUrl: './add-propietario.component.css'
})
export class AddPropietarioComponent {
  formulario: FormGroup;
  array_CR_InteresadoTipo = Object.values(CR_InteresadoTipo);
  array_CR_DocumentoTipo = Object.values(CR_DocumentoTipo);
  array_CR_SexoTipo = Object.values(CR_SexoTipo);
  array_Grupo_Etnico = Object.values(Grupo_Etnico);
  autorizaProcesamientoDatosPersonales: boolean = false;
  tipo: CR_InteresadoTipo = CR_InteresadoTipo.Persona_Natural;
  tipoDocumento: CR_DocumentoTipo = CR_DocumentoTipo.Cedula_Ciudadania;
  documentoIdentidad: string = '';
  primerNombre: string = '';
  segundoNombre: string = '';
  primerApellido: string = '';
  segundoApellido: string = '';
  sexo: CR_SexoTipo = CR_SexoTipo.Masculino;
  grupoEtnico: Grupo_Etnico = Grupo_Etnico.Ninguno;
  telefono1: string = '';
  telefono2: string = '';
  correoElectronico: string = '';
  autorizaNotificacionCorreo: boolean = false;
  departamentos: Departamento[] = departamentos;
  municipios: Municipio[]  = municipios;
  municipiosFiltrados: Municipio[] = [];
  departamentoSeleccionado: string = '';
  municipioSeleccionado: string = '';
  notas: string = '';
  porcentajePropiedad: number = 0;
  estado: Estado = Estado.Soltero;


  constructor(private propietarioService: PropietarioService, private router: Router, private predioService: PredioService, private dataService: DataService, private snackBar: MatSnackBar) {
    // Inicializa el FormGroup dentro del constructor
    this.formulario = new FormGroup({
      tipoDocumento: new FormControl('', Validators.required),
      documentoIdentidad: new FormControl('', [Validators.required, Validators.minLength(4)]),
      tipo: new FormControl('', Validators.required),
      primerNombre: new FormControl('', Validators.required),
      segundoNombre: new FormControl(''), // No requerido
      primerApellido: new FormControl('', Validators.required),
      segundoApellido: new FormControl(''), // No requerido
      sexo: new FormControl('', Validators.required),
      grupoEtnico: new FormControl(''), // No requerido
      telefono1: new FormControl(''), // No requerido
      telefono2: new FormControl(''), // No requerido
      correoElectronico: new FormControl('', [Validators.required, Validators.email]),
      departamentoSeleccionado: new FormControl('', Validators.required),
      municipioSeleccionado: new FormControl('', Validators.required),
      notas: new FormControl(''),
      porcentajePropiedad: new FormControl('', [Validators.required, Validators.min(0), Validators.max(100)]),
      estado: new FormControl(''), // No requerido
      autorizaProcesamientoDatosPersonales: new FormControl(false, Validators.requiredTrue), // Requiere ser true para ser válido
      autorizaNotificacionCorreo: new FormControl(false, Validators.requiredTrue)
    });
  }
  ngOnInit() {
    // this.dataService.getDepartamentos().subscribe(data => {
    //   this.departamentos = data;
    // });

    // this.dataService.getMunicipios().subscribe(data => {
    //   this.municipios = data;
    // });
    // console.log(this.departamentos)
  }

  onDepartamentoChange() {
    this.municipiosFiltrados = this.municipios.filter(
      m => m.departamento === this.formulario.value.departamentoSeleccionado
    );

    // Resetea la selección del municipio si el departamento cambia
    this.formulario.get('municipioSeleccionado')!.setValue('');
  }
  guardarPropietario() {
    if (this.formulario.valid) {
      const nuevoPropietario = new Propietario(
        this.formulario.value.autorizaProcesamientoDatosPersonales,
        this.formulario.value.tipo,
        this.formulario.value.tipoDocumento,
        this.formulario.value.documentoIdentidad,
        this.formulario.value.primerNombre,
        this.formulario.value.segundoNombre,
        this.formulario.value.primerApellido,
        this.formulario.value.segundoApellido,
        this.formulario.value.sexo,
        this.formulario.value.grupoEtnico,
        this.formulario.value.telefono1,
        this.formulario.value.telefono2,
        this.formulario.value.correoElectronico,
        this.formulario.value.autorizaNotificacionCorreo,
        this.formulario.value.departamentoSeleccionado,
        this.formulario.value.municipioSeleccionado,
        this.formulario.value.notas,
        this.formulario.value.porcentajePropiedad,
        this.formulario.value.estado
      );

      if (!this.propietarioService.documentoIdentidadExists(this.formulario.value.documentoIdentidad)) {
        this.propietarioService.addPropietario(nuevoPropietario);

        let predioActual = this.predioService.obtenerPredioActual();
        console.log("el id del predio actual es: ", predioActual.id);
        predioActual.propietarios.push(nuevoPropietario);
        console.log(predioActual);

        this.snackBar.open('Propietario agregado con éxito', 'Cerrar', { duration: 3000 });

        this.router.navigate(['/nuevo-predio/' , predioActual.id, 'datos-propietario']);
      } else {
        alert('Documento de identidad duplicado');
      }
    } else {
      this.snackBar.open('Por favor, completa todos los campos requeridos', 'Cerrar', { duration: 3000 });
    }
  }


  protected readonly CR_SexoTipo = CR_SexoTipo;
  protected readonly Grupo_Etnico = Grupo_Etnico;
  protected readonly CR_InteresadoTipo = CR_InteresadoTipo;
  protected readonly CR_DocumentoTipo = CR_DocumentoTipo;
}
