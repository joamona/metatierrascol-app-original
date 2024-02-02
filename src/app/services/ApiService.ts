import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Preferences} from "@capacitor/preferences";
import { lastValueFrom } from 'rxjs';
import JSZip from 'jszip';
import {PredioService} from "./PredioService";
import {Predio} from "../models/predio.model";
import {JWTTokenService} from "./jwtTokenService";
import {MatSnackBar} from "@angular/material/snack-bar";
import * as GeoJSON from 'geojson';

interface AuthResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl: string = '';
  private user: string | null = null;
  private password: string | null = null;

  constructor(private http: HttpClient, private predioService: PredioService, private snackBar: MatSnackBar, private tokenService: JWTTokenService) {
    this.cargarConfiguracion();
  }


  // Guardar configuración y token
  async setConfiguracion(apiUrl: string, user: string, password: string) {
    this.apiUrl = apiUrl;
    this.user = user;
    this.password = password;

    // Guardar configuración
    await Preferences.set({ key: 'apiUrl', value: apiUrl });
    await Preferences.set({ key: 'user', value: user });
    //NO SE GUARDAN LOS PASSWORDS, A NO SER QUE ESTÉN ECRIPTADOS
    //PERO ES ESTA APP NO HACE FALTA. SOLO EL TOKEN.
    //await Preferences.set({ key: 'password', value: password });
  }

  // Cargar configuración y token
  async cargarConfiguracion() {
    const apiUrlData = await Preferences.get({ key: 'apiUrl' });
    const userData = await Preferences.get({ key: 'user' });
    //const passwordData = await Preferences.get({ key: 'password' });

    this.apiUrl = apiUrlData.value || '';
    this.user = userData.value || '';
    //this.password = passwordData.value || '';

    const tokenData = await Preferences.get({ key: 'authToken' });
    console.log("el token almacenado es: ", tokenData.value)
    if (tokenData.value) {
      this.tokenService.setToken(tokenData.value);
    }
  }

// Autenticar y obtener token

// (error: HttpErrorResponse) => {
//   var msg:string;
//   switch (error.status){
//     case 400:
//       msg="The version is not the last";
//       break;
//     case 401:
//       msg="You must supply the gid";
//       break;
//     default:{
//       msg="The file does not exist";
//       break;
//     }
//   }//switch

  async autenticar(): Promise<string> {
    if (this.tokenService.isTokenExpired()) {
      const url = `${this.apiUrl}/core/knox/login/`;
      const body = { username: this.user, password: this.password };

      try {
        const response = await lastValueFrom(this.http.post<AuthResponse>(url, body));
        if (response && response.token) {
          this.tokenService.setToken(response.token);
          await Preferences.set({ key: 'authToken', value: response.token });
          return response.token;
        } else {
          throw new Error('Autenticación fallida: Respuesta no válida de la API');
        }
      } catch (error) {
        this.snackBar.open('Error en la autenticación. Por favor, revisa tus credenciales.', 'Cerrar', { duration: 3000, verticalPosition: 'top' });
        throw error;
      }
    } else {
      alert('La sesión actual es válida. Cierre la sesión para cambiar de usuario y obtener una nueva')
      return this.tokenService.getToken();
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

  obtenerNombreArchivo(url: string): string {
    // Extrae el nombre del archivo de la URL
    const nombreArchivo = url.split('/').pop();
    if (nombreArchivo === undefined) {
      throw new Error('No se pudo obtener el nombre del archivo');
    }
    return nombreArchivo;
  }

  async enviarDatosAPI(predio: Predio) {
    const token = await this.autenticar(); // Verifica la autenticación

    if (!token) {
      console.error('No se pudo obtener un token válido.');
      return;
    }

    const archivoZip = await this.crearArchivoZipParaPredio(predio);

    if (!archivoZip) {
      console.error(`El archivo ZIP para el predio ${predio.id} es demasiado grande y no se enviará.`);
      return;
    }

    try {
      await this.enviarPredioAlServidor(predio, archivoZip, token);
    } catch (error) {
      console.error(`Error al enviar el predio ${predio.id}:`, error);
    }
  }



  async crearArchivoZipParaPredio(predio: Predio): Promise<Blob | null> {
    const zip = new JSZip();
    const carpetaDocumentos = zip.folder('Documentos');
    const carpetaImagenes = zip.folder('Imagenes');

    // Agrega imágenes del predio
    if (predio.imagenes && carpetaImagenes) {
      for (let imagen of predio.imagenes) {
        if (imagen.imageData) {
          const contenidoImagen = await this.obtenerContenidoArchivo(imagen.imageData);
          carpetaImagenes.file(this.obtenerNombreArchivo(imagen.imageData), contenidoImagen);
        }
      }
    }

    if (predio.documentos && carpetaDocumentos) {
      for (let documento of predio.documentos) {
        const carpetaDoc = carpetaDocumentos.folder(`Documento-${documento.id}`);
        if (carpetaDoc) {
          const carpetaImagenesDoc = carpetaDoc.folder('Imagenes');
          const carpetaArchivosDoc = carpetaDoc.folder('Archivos');

        // Agrega imágenes del documento
        if (documento.imagenes && carpetaImagenesDoc) {
          for (let imagenDoc of documento.imagenes) {
            if (imagenDoc) {
              const contenidoImagenDoc = await this.obtenerContenidoArchivo(imagenDoc);
              carpetaImagenesDoc.file(this.obtenerNombreArchivo(imagenDoc), contenidoImagenDoc);
            }
          }
        }

        // Agrega archivos del documento
        if (documento.pdfs && carpetaArchivosDoc) {
          for (let archivo of documento.pdfs) {
            if (archivo && archivo.name) {
              const contenidoArchivo = await archivo.arrayBuffer();
              carpetaArchivosDoc.file(archivo.name, contenidoArchivo);
            }
          }
        }

          const jsonDocumento = JSON.stringify(documento);
          carpetaDoc.file(`documento-${documento.id}.json`, jsonDocumento);
        }
      }
    }

    const jsonPredio = JSON.stringify(predio.datosPredio);
    zip.file('datosPredio.json', jsonPredio);

    const jsonPropietarios = JSON.stringify(predio.propietarios);
    zip.file('propietarios.json', jsonPropietarios);

    const jsonGeometrias = JSON.stringify(predio.geometrias);
    zip.file('geometrias.json', jsonGeometrias);

    const jsonDocumentos = JSON.stringify(predio.documentos);
    zip.file('documentos.json', jsonDocumentos);

    const jsonImagenes = JSON.stringify(predio.imagenes);
    zip.file('imagenes.json', jsonImagenes);

// Genera el archivo GeoJSON para la geometría del predio
    const geoJSON = this.crearGeoJSONDeGeometrias(predio.geometrias);
    const jsonGeoJSON = JSON.stringify(geoJSON);
    zip.file('geometriaPredio.geojson', jsonGeoJSON);



    // Genera el contenido del ZIP
    const zipBlob = await zip.generateAsync({ type: 'blob' });

    // Comprueba el tamaño del ZIP
    if (zipBlob.size > 200 * 1024 * 1024) { // 200 MB en bytes
      this.snackBar.open('El tamaño del archivo ZIP supera el límite de 200 MB.', 'Cerrar', {
        duration: 5000,
        verticalPosition: "top"
      });
      return null;
    }

    return zipBlob;
  }

  private crearGeoJSONDeGeometrias(geometrias: any[]): GeoJSON.FeatureCollection<GeoJSON.Polygon> {
    // Comprueba que las coordenadas formen un polígono cerrado
    if (geometrias[0].x !== geometrias[geometrias.length - 1].x ||
      geometrias[0].y !== geometrias[geometrias.length - 1].y) {
      geometrias.push(geometrias[0]); // Añade la primera coordenada al final para cerrar el polígono
    }

    const coordinates = geometrias.map(geometria => [geometria.x, geometria.y]);
    const precisiones = geometrias.map(geometria => ({ precisionX: geometria.precisionX, precisionY: geometria.precisionY }));

    const feature: GeoJSON.Feature<GeoJSON.Polygon> = {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [coordinates]
      },
      properties: {
        precisiones: precisiones
      }
    };

    return {
      type: 'FeatureCollection',
      features: [feature]
    };
  }




  async enviarPredioAlServidor(predio: Predio, archivoZip: Blob, token: string) {
    const formData = new FormData();
    // Rellena el formData con los datos del predio
    if (predio.datosPredio) {
      formData.append("nombre", predio.datosPredio.nombre || 'Nombre no especificado');
      formData.append("departamento", predio.datosPredio.departamento || 'Departamento no especificado');
      formData.append("provincia", predio.datosPredio.provincia || 'Provincia no especificado');
      formData.append("sector_predio", predio.datosPredio.sectorPredio || 'Sector del predio no especificado');
      formData.append("municipio", predio.datosPredio.municipio || 'Municipio no especificado');
      formData.append("numero_predial", predio.datosPredio.numeroPredial || '');
      formData.append("tipo", predio.datosPredio.tipo || 'Tipo no especificado');
      formData.append("complemento", predio.datosPredio.complemento || 'Complemento no especificado');
      formData.append("archivo", archivoZip, "predio.zip");
    } else {
      console.error('Datos del predio faltantes para', predio.id);
      return;
    }

    // Configuración header con el token de autenticación
    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`,
    });

    // URL del endpoint del servidor
    const url = `${this.apiUrl}/source/archivo_zip/`;

    // Envia datos al servidor
    try {
      const response = await lastValueFrom(this.http.post(url, formData, { headers }));
      this.snackBar.open(`Respuesta del servidor para el predio ${predio.id} : ${response}`, 'Cerrar', {
        duration: 5000, verticalPosition: "top"
      });
      console.log("Respuesta del servidor para el predio", predio.id, ":", response);
      console.log("Predio enviado con éxito:", predio.id);
      this.predioService.aumentarPrediosEnviados();
    } catch (error) {
      console.error('Error al enviar predio', predio.id, ':', error);
      this.snackBar.open('Error al enviar datos: ' + error, 'Cerrar', { duration: 5000, verticalPosition: "top" });

    }
  }

}

