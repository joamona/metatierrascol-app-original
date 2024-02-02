import { Component } from '@angular/core';
import {PredioService} from "../../services/PredioService";
import {RouterLink} from "@angular/router";
import {MatButtonModule} from "@angular/material/button";
import {Coordenadas} from "../../models/geometria.model";

@Component({
  selector: 'app-seleccionar-geometria',
  standalone: true,
  imports: [
    RouterLink,
    MatButtonModule
  ],
  templateUrl: './seleccionar-geometria.component.html',
  styleUrl: './seleccionar-geometria.component.css'
})
export class SeleccionarGeometriaComponent {
  selectedFile: File | null = null;

  constructor(private predioService: PredioService) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  async guardarGeometria() {
    if (!this.selectedFile) {
      alert('Por favor, selecciona un archivo GeoJSON');
      return;
    }

    const reader = new FileReader();
    reader.readAsText(this.selectedFile, 'UTF-8');
    reader.onload = async () => {
      const geojson = JSON.parse(reader.result as string);
      const geometriaProcesada = this.procesarGeoJSON(geojson);
      let predioActual = this.predioService.obtenerPredioActual();

      // Combina las geometrías existentes con las nuevas
      predioActual.geometrias = predioActual.geometrias.concat(geometriaProcesada);

      this.predioService.guardarPredioActual(predioActual);
      console.log(predioActual);
    };
    reader.onerror = (error) => {
      console.error('Error al leer el archivo:', error);
    };
  }

  procesarGeoJSON(geojson: any): Coordenadas[] {
    console.log("Procesando GeoJSON:", geojson);

    if (!geojson.features || !Array.isArray(geojson.features)) {
      console.error('Formato de GeoJSON no válido');
      return [];
    }

    let coordenadasExtraidas: Coordenadas[] = [];

    for (let feature of geojson.features) {
      if (feature.geometry && feature.geometry.type === 'Polygon') {
        let coordenadasPoligono = feature.geometry.coordinates;

        if (coordenadasPoligono.length > 0 && Array.isArray(coordenadasPoligono[0])) {
          coordenadasPoligono[0].forEach(coord => {
            coordenadasExtraidas.push(new Coordenadas(
              coord[0], // x
              coord[1], // y
              0,
              0,
              0,
              '',
              ''
            ));
          });
        }
      }
    }

    console.log("Coordenadas extraídas:", coordenadasExtraidas);
    return coordenadasExtraidas;
  }





}
