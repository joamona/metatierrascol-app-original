import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Departamento, Municipio, Provincia} from "../models/propietario.model";
import {BehaviorSubject} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  getDepartamentos() {
    return this.http.get<Departamento[]>('/assets/departamentos.json');
  }

  getMunicipios() {
    return this.http.get<Municipio[]>('/assets/municipios.json');

  }
  getProvincias(){
    return this.http.get<Provincia[]>('/assets/provincias.json');

  }

  private src = new BehaviorSubject<string>('EPSG:4326'); // Valor por defecto

  // Observable que permite a los componentes suscribirse a cambios de SRC
  src$ = this.src.asObservable();

  // Método para actualizar el SRC
  setSrc(newSrc: string) {
    this.src.next(newSrc);
  }

  // Método para obtener una nueva vista con la proyección actualizada
 /* getUpdatedView(currentView: View, newProjectionCode: string): View {
    let currentCenter = currentView.getCenter();
    // Proporcionar un centro por defecto si no hay uno definido
    if (!currentCenter) {
      // Puedes reemplazar estas coordenadas con un centro por defecto para tu aplicación
      currentCenter = transform([0, 0], 'EPSG:4326', newProjectionCode);
    }

    const newCenter = transform(currentCenter, currentView.getProjection(), newProjectionCode);

    return new View({
      projection: newProjectionCode,
      center: newCenter,
      zoom: currentView.getZoom(),
      rotation: currentView.getRotation(),
    });
  }*/

}
