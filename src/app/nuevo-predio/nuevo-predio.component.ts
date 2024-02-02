import { Component } from '@angular/core';
import {PredioService} from "../services/PredioService";
import {Router} from "@angular/router";
import {ApiService} from "../services/ApiService";
import {Predio} from "../models/predio.model";
import {HttpErrorResponse} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";
import {JWTTokenService} from "../services/jwtTokenService";
import Swal from "sweetalert2";
import {NetStatusService} from "../services/net-status.service";
@Component({
  selector: 'app-nuevo-predio',
  templateUrl: './nuevo-predio.component.html',
  styleUrl: './nuevo-predio.component.css'
})
export class NuevoPredioComponent {

  predioActual: Predio;
  //predioActual: Predio = new Predio(0, [], null, [], [], []);
  puedeEnviar: boolean = false;
  numeroPropietarios: number = 0;
  numeroDocumentos: number = 0;
  numeroImagenes: number = 0;
  numeroGeometriasDigitalizadas: number = 0;
  numeroGeometriasGPS: number = 0;
  numeroDatosPredio: number = 0;

  constructor(private predioService: PredioService, private apiService: ApiService, private snackBar: MatSnackBar, private tokenService: JWTTokenService, private netStatusService: NetStatusService) {
  }

  ngOnInit() {
    this.predioActual = this.predioService.obtenerPredioActual();
    this.verificarTokenYDatosPredio();
    this.apiService.cargarConfiguracion();
    this.actualizarInfo();
  }


  actualizarInfo() {
    this.numeroPropietarios = this.predioActual.propietarios.length;
    this.numeroGeometriasDigitalizadas = this.predioActual.geometrias.length;
    this.numeroImagenes = this.predioActual.imagenes.length;
    this.numeroDocumentos = this.predioActual.documentos.length;
    this.numeroGeometriasGPS = this.predioActual.geometrias.length;
    if (this.predioActual.datosPredio) {
      this.numeroDatosPredio = 1;

    }
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

  guardarPredio() {

    console.log(this.predioActual)

    this.predioService.guardarPredioActual(this.predioActual);

    // Guardar información del predio en el dispositivo
    this.predioService.guardarPredioEnDispositivo(this.predioActual).then(() => {
      console.log("Predio guardado en el dispositivo");
      this.snackBar.open('Predio guardado en el dispositivo', 'Cerrar', {duration: 3000, verticalPosition: "top"});

      // Navegar a otra página si es necesario o mostrar mensaje de éxito
    }).catch(error => {
      console.error("Error al guardar el predio en el dispositivo:", error);
      // Manejar el error
    });
  }

  async enviarAlServidor() {

    let predioActual = this.predioService.obtenerPredioActual();
    console.log(predioActual);
    try {
      await this.apiService.enviarDatosAPI(predioActual);
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

  borrarGeometrias() {
    Swal.fire({
      title: 'Confirmación',
      text: "¿Está seguro de que desea borrar todas las geometrías?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.predioActual) {
          this.predioActual.geometrias = [];
          // Mensaje de confirmación
          this.snackBar.open('Todas las geometrías han sido borradas', 'Cerrar', {duration: 3000, verticalPosition: "top"});
        }

        console.log(this.predioActual);
      }
    });
  }
}
