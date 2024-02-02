import { Injectable } from '@angular/core';
import { Predio } from '../models/predio.model';
import { Preferences } from '@capacitor/preferences';
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";
import {Directory, Encoding, Filesystem} from "@capacitor/filesystem";
@Injectable({
  providedIn: 'root',
})

export class PredioService {
  private routeParamsSubscription: Subscription;
  //private predioActual: Predio = new Predio(0, [], null, [], [], []);
  private predioActual: Predio;
  private listaPredios: Predio[] = [];
  private prediosEnviados = 0;
  private readonly PREFERENCES_KEY = 'listaPredios';

  constructor(private route: ActivatedRoute) {
    this.cargarListaPredios();
    this.routeParamsSubscription = this.route.params.subscribe(params => {
      const predioId = +params['id'];
      this.setPredioActualById(predioId);
    });
  }

  nuevoPredio() {
    //this.predioActual = new Predio(this.contadorIds++,[],null,[],[],[]);
    this.predioActual = new Predio(0, [], null, [], [], []);
  }

  setPredioActualById(predioId: number) {
    const actPredio = this.listaPredios.find(predio => predio.id === predioId);
    if (actPredio) {
      this.predioActual = actPredio;
    }
  }

  obtenerPredioActual(): Predio {
    let predioId = +this.route.snapshot.params['id'];
    let actPredio = this.listaPredios.find((predio) => predio.id === predioId);

    if (actPredio) {
      return actPredio;
    } else {
      return this.predioActual;
    }
  }


  guardarPredioActual(predio: Predio) {
    this.predioActual = predio;

    // Actualiza la lista de predios con el predio actualizado
    const index = this.listaPredios.findIndex(p => p.id === predio.id);
    if (index !== -1) {
      this.listaPredios[index] = predio;
    } else {
      this.listaPredios.push(predio);
    }

    this.guardarListaPredios();
  }

  getListaPredios(): Predio[] {
    return this.listaPredios;
  }

  getPrediosEnviados() {
    return this.prediosEnviados;
  }

  aumentarPrediosEnviados() {
    this.prediosEnviados += 1;
  }

  private async cargarListaPredios() {
    let listaPrediosGuardada = await Preferences.get({key: this.PREFERENCES_KEY});
    if (listaPrediosGuardada && listaPrediosGuardada.value) {
      this.listaPredios = JSON.parse(listaPrediosGuardada.value);
    }
  }

  public async guardarListaPredios() {
    await Preferences.set({
      key: this.PREFERENCES_KEY,
      value: JSON.stringify(this.listaPredios),
    });
  }

  borrarPredioActual() {

    let index = this.listaPredios.findIndex(predio => predio.id === this.predioActual.id);

    if (index !== -1) {
      // Elimina el predio actual de la lista de predios
      this.listaPredios.splice(index, 1);

      // Guarda la lista actualizada en el almacenamiento
      this.guardarListaPredios();

      // Crea un nuevo predio
      this.nuevoPredio();
    } else {
      console.error('No se pudo encontrar el predio actual en la lista de predios.');
    }
  }


  ngOnDestroy() {
    this.routeParamsSubscription.unsubscribe();
  }

  async guardarPredioEnDispositivo(predio: Predio) {

    let horaActual = new Date().toLocaleTimeString().replace(/:/g, '-');
    // Comprobar y crear la carpeta 'MetaTierras'
    await this.verificarYCrearCarpeta('MetaTierras');

    // Crear carpeta del predio
    const carpetaPredio = `MetaTierras/Predio-${horaActual}`;
    await this.verificarYCrearCarpeta(carpetaPredio);

    // Guardar datos del predio, propietarios, geometrías, etc.
    await this.guardarArchivoJson(predio.datosPredio, `${carpetaPredio}/datosPredio.json`);
    await this.guardarArchivoJson(predio.propietarios, `${carpetaPredio}/propietarios.json`);
    await this.guardarArchivoJson(predio.geometrias, `${carpetaPredio}/geometrias.json`);

    // Guardar imágenes del predio
    const carpetaImagenesPredio = `${carpetaPredio}/Imagenes`;
    await this.verificarYCrearCarpeta(carpetaImagenesPredio);
    for (let imagen of predio.imagenes) {
      if (imagen && imagen.imageData) {
        await this.guardarImagen(imagen.imageData, carpetaImagenesPredio);
      }
    }

    // Crear y guardar documentos
    const carpetaDocumentos = `${carpetaPredio}/Documentos`;
    await this.verificarYCrearCarpeta(carpetaDocumentos);
    for (const documento of predio.documentos) {
      const carpetaDocumento = `${carpetaDocumentos}/Documento-${documento.id}`;
      await this.verificarYCrearCarpeta(carpetaDocumento);

      // Guardar imágenes de documentos
      const carpetaImagenesDocumento = `${carpetaDocumento}/Imagenes`;
      await this.verificarYCrearCarpeta(carpetaImagenesDocumento);
      for (const imagenDoc of documento.imagenes) {
        if (imagenDoc) {
          await this.guardarImagen(imagenDoc, carpetaImagenesDocumento);
        }
      }

      // Guardar archivos de documentos (PDFs, Word, etc.)
      const carpetaArchivosDocumento = `${carpetaDocumento}/Archivos`;
      await this.verificarYCrearCarpeta(carpetaArchivosDocumento);
      for (const archivo of documento.pdfs) {
        if (archivo) {
          await this.guardarArchivo(archivo, carpetaArchivosDocumento);
        }
      }
    }
  }

  private async guardarArchivo(archivo: File, pathCarpeta: string) {
    try {
      const archivoBlob = await archivo.arrayBuffer();
      const base64Archivo = await this.convertBlobToBase64(new Blob([archivoBlob]));

      await Filesystem.writeFile({
        path: `${pathCarpeta}/${archivo.name}`,
        data: base64Archivo,
        directory: Directory.Documents,
      });

      console.log("Archivo guardado:", `${pathCarpeta}/${archivo.name}`);
    } catch (error) {
      console.error('Error al guardar archivo:', pathCarpeta, archivo.name, error);
    }
  }




  private convertBlobToBase64 = (blob: Blob) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.readAsDataURL(blob);
  });

  private async guardarArchivoJson(data: any, path: string) {
    await Filesystem.writeFile({
      path: path,
      data: JSON.stringify(data),
      directory: Directory.Documents,
      encoding: Encoding.UTF8,
    });
  }


  private async verificarYCrearCarpeta(path: string) {
    try {

      // Crear la nueva carpeta
      console.log("Creando carpeta nueva: ", path);
      await Filesystem.mkdir({
        path: path,
        directory: Directory.Documents,
        recursive: true
      });
      console.log("Carpeta creada: ", path);
    } catch (error) {
      console.error('Error al verificar y crear carpeta:', path, error);
    }
  }



  async guardarImagen(imagePath: string, carpetaImagenes: string) {
    try {
      const response = await fetch(imagePath);
      const blob = await response.blob();
      const base64Data = await this.convertBlobToBase64(blob);

      const imageName = new Date().getTime() + '.jpeg'; // o extraer el nombre de archivo de imagePath si es necesario

      await Filesystem.writeFile({
        path: `${carpetaImagenes}/${imageName}`,
        data: base64Data,
        directory: Directory.Documents,
      });

      console.log("Imagen guardada localmente:", `${carpetaImagenes}/${imageName}`);
    } catch (error) {
      console.error('Error al guardar imagen localmente:', imagePath, error);
    }
  }



  async obtenerContenidoArchivo(url: string): Promise<Blob> {
    // Verifica si la URL es un blob local
    if (url.startsWith('blob:')) {
      // Convierte blob URL a Blob
      const response = await fetch(url);
      return await response.blob();
    } else {
      // Si es una URL remota, se puede obtener directamente como un Blob
      const response = await fetch(url);
      return await response.blob();
    }
  }


  public verificarDatosPredio(predio: Predio): boolean {
    // Verifica si hay datos básicos del predio
    const datosPredio = predio.datosPredio && Object.keys(predio.datosPredio).length > 0;

    // Verifica si hay al menos un propietario
    const datosPropietario = predio.propietarios && predio.propietarios.length > 0;

    // Verifica si hay al menos una geometría
    const datosGeometria = predio.geometrias && predio.geometrias.length > 0;

    return <boolean>datosPredio && datosPropietario && datosGeometria;
  }

}
