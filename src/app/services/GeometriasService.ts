import { Injectable } from '@angular/core';
import { Coordenadas } from '../models/geometria.model';
import { Preferences } from '@capacitor/preferences';
@Injectable({
  providedIn: 'root',
})
export class GeometriasService {
  private geometria: Coordenadas[] = [];
  private readonly PREFERENCES_KEY = 'geometrias';



  constructor() {}

 /* crearCoordenadas(x: number, y: number, precisionX: number = 5, precisionY: number = 5): Coordenadas {
    return new Coordenadas(x, y, precisionX, precisionY);
  }
*/

  /*mapearCoordenadasPoligono(coordinates: number[][]): Coordenadas[] {
    return coordinates.map(coord => this.crearCoordenadas(coord[0], coord[1]));
  }*/

  mapearCoordenadasPoligono(coordinates: number[][]): Coordenadas[] {
    let contador = 1;
    return coordinates.map(coord => {
      // Asigna la precisión estándar para digitalización manual
      const precisionX = 10;
      const precisionY = 10;

      // Crea un objeto Coordenadas con el contador como número de coordenada
      const coordenada = new Coordenadas(coord[0], coord[1], precisionX, precisionY, contador, '--', 'GPS');
      contador++;
      return coordenada;
    });
  }



  agregarGeometria(coordenadas: Coordenadas[]) {
    this.geometria.push(...coordenadas);
    this.guardarGeometrias();
  }

  obtenerGeometrias(): Coordenadas[] {
    return this.geometria;
  }

  limpiarGeometrias() {
    this.geometria = [];
    this.guardarGeometrias();
  }




  private async guardarGeometrias() {
    await Preferences.set({
      key: this.PREFERENCES_KEY,
      value: JSON.stringify(this.geometria),
    });
  }

  private async cargarGeometrias() {
    let geometriasAlmacenadas = await Preferences.get({ key: this.PREFERENCES_KEY });
    this.geometria = geometriasAlmacenadas && geometriasAlmacenadas.value
      ? JSON.parse(geometriasAlmacenadas.value) : [];
  }
}


