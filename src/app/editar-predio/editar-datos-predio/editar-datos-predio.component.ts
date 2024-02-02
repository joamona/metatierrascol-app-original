import { Component } from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {PredioService} from "../../services/PredioService";
import {MatButtonModule} from "@angular/material/button";
import {MatSnackBar} from "@angular/material/snack-bar";
import {HttpErrorResponse} from "@angular/common/http";
import {ApiService} from "../../services/ApiService";
import {JWTTokenService} from "../../services/jwtTokenService";
import {NetStatusService} from "../../services/net-status.service";

@Component({
  selector: 'app-editar-datos-predio',
  standalone: true,
  imports: [
    RouterLink,
    MatButtonModule
  ],
  templateUrl: './editar-datos-predio.component.html',
  styleUrl: './editar-datos-predio.component.css'
})
export class EditarDatosPredioComponent {
  titulo: string =  "Editar Predio ";
  predioActual = this.predioService.obtenerPredioActual();
  predioActualId?: number;
  puedeEnviar: boolean = false;

  constructor(private predioService: PredioService, private tokenService: JWTTokenService, private netStatusService: NetStatusService, private router: Router, private route: ActivatedRoute, private snackBar: MatSnackBar, private apiService: ApiService) {


  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const predioId = +params['id'];
      this.predioActualId = predioId; // Guarda el ID del predio actual
      this.cargarPredio(predioId);
    });
    this.verificarTokenYDatosPredio();

  }

  async verificarTokenYDatosPredio() {
    const tokenValido = !this.tokenService.isTokenExpired();
    const datosPredioCompletos = this.predioService.verificarDatosPredio(this.predioActual);

    console.log("el token es: ", tokenValido);
    console.log("los datos estan completos: ", datosPredioCompletos);
    console.log("Hay internet: ", this.netStatusService.available)

    this.puedeEnviar = tokenValido && datosPredioCompletos && this.netStatusService.available;
    console.log(`Token válido: ${tokenValido}, Datos del predio completos: ${datosPredioCompletos}`);
    console.log(this.puedeEnviar)
  }
  private cargarPredio(predioId: number) {
    const predioSeleccionado = this.predioService.getListaPredios().find(predio => predio.id === predioId);
    if (predioSeleccionado) {
      this.predioActual = predioSeleccionado;
      this.titulo += this.predioActual.id;
    } else {
      console.error('Predio no encontrado con ID:', predioId);
    }
  }
  editarDatosPropietario() {

    if (this.predioActualId != null) {
      this.router.navigate(['/nuevo-predio/', this.predioActualId, 'datos-propietario']);
    } else {
      console.error('ID del predio no está definido');
    }
  }
  editarDatosPredio() {

    if (this.predioActualId != null) {
      this.router.navigate(['/nuevo-predio/', this.predioActualId, 'datos-predio']);
    } else {
      console.error('ID del predio no está definido');
    }
  }
  guardarPredio() {
    this.predioService.guardarPredioActual(this.predioActual);
    this.snackBar.open('Predio guardado correctamente', 'Cerrar', {
      duration: 3000,
      verticalPosition: "top"
    });
  }

  async enviarAlServidor() {
    console.log(this.predioActual);
    try {
      await this.apiService.enviarDatosAPI(this.predioActual);
      this.snackBar.open('Datos enviados con éxito al servidor', 'Cerrar', {duration: 3000, verticalPosition: "top"});
    } catch (error) {
      let mensajeError: string;

      if (error instanceof HttpErrorResponse) {
        mensajeError = `Error ${error.status}: ${error.statusText}`;
      } else if (error instanceof Error) {
        mensajeError = error.message;
      } else {
        mensajeError = 'Error desconocido al enviar datos al servidor';
      }

      this.snackBar.open(mensajeError, 'Cerrar', {duration: 5000, verticalPosition: "top"});
    }
  }

}
