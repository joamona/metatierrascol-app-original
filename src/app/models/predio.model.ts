import { Propietario } from './propietario.model';
import { DatosPredio } from './datosPredio.model';
import { Imagen } from './imagen.model';
import { Documento } from './documento.model';
import { Coordenadas } from './geometria.model';

export class Predio {
  id: number;
  propietarios: Propietario[];
  datosPredio: DatosPredio | null;
  imagenes: Imagen[];
  documentos: Documento[];
  geometrias: Coordenadas[];

  constructor(id:number, propietarios: Propietario[], datosPredio: DatosPredio | null, imagenes: Imagen[], documentos: Documento[], geometrias: Coordenadas[]) {
    this.id = id;
    this.propietarios = propietarios;
    this.datosPredio = datosPredio ;
    this.imagenes = imagenes;
    this.documentos = documentos;
    this.geometrias = geometrias;
  }
}
