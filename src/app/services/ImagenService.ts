import {Injectable} from '@angular/core';
import {Imagen, LC_FuenteAdministrativaTipo} from '../models/imagen.model';
import {Camera, CameraResultType, CameraSource, Photo} from '@capacitor/camera';
import {Directory, Filesystem} from '@capacitor/filesystem';
import {PredioService} from "./PredioService";
import {Preferences} from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class ImagenService {
  private imagenes: Imagen[] = [];
  private readonly IMAGENES_KEY = 'imagenes';


  constructor(private predioService: PredioService) {
    this.cargarImagenes();
  }

  getImagenes(): Imagen[] {
    return this.imagenes;
  }

  addImagen(imagen: Imagen) {
    this.imagenes.push(imagen);
    this.guardarImagen();
  }

  eliminarImagen(index: number) {

    if (index >= 0 && index < this.imagenes.length) {
      this.imagenes.splice(index, 1);
      this.guardarImagen();
    }
  }

  async addNewToGallery(): Promise<Photo> {
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    });

    const savedImageFile = await this.savePicture(capturedPhoto);

    this.imagenes.push(savedImageFile);
    await this.guardarImagen();

    return capturedPhoto;
  }

  private async savePicture(photo: Photo): Promise<Imagen> {
    const base64Data = await this.readAsBase64(photo);
    let imageBlob = await this.convertBase64ToBlob(base64Data);

    // Reducir el tamaño si es necesario (300-400 KB)
    if (imageBlob.size > 400 * 1024) { // 400 KB en bytes
      imageBlob = await this.resizeImage(imageBlob);
    }

    const fileName = new Date().getTime() + '.jpeg';


    return {
      imageData: fileName,
      notas: "",
      tipo_doc: LC_FuenteAdministrativaTipo.Sin_Documento,
    };
  }


  private convertBase64ToBlob(base64: string): Promise<Blob> {
    return fetch(base64).then(res => res.blob());
  }

  private async resizeImage(blob: Blob): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(blob);

      img.onload = () => {
        // Calcula el nuevo tamaño conservando la proporción de la imagen
        const maxWidth = 800; // Ancho máximo
        const maxHeight = 600; // Alto máximo
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }

        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }

        // Crea un canvas para el redimensionamiento
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
        } else {
          throw new Error('No se pudo obtener el contexto 2D del canvas');
        }


        // Convierte el canvas a Blob
        canvas.toBlob((resizedBlob) => {
          if (resizedBlob) {
            resolve(resizedBlob);
          } else {
            reject(new Error('Error al redimensionar la imagen'));
          }
        }, 'image/jpeg', 0.9); // Compresión al 90%
      };

      img.onerror = () => {
        reject(new Error('Error al cargar la imagen para redimensionar'));
      };
    });
  }

  private async readAsBase64(photo: Photo) {
    const response = await fetch(photo.webPath!);
    const blob = await response.blob();
    return await this.convertBlobToBase64(blob) as string;
  }

  convertBlobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('El resultado de FileReader no es una cadena'));
        }
      };
      reader.readAsDataURL(blob);
    });
  };


  actualizarImagen(index: number, imagen: Imagen) {
    this.imagenes[index] = imagen;
    this.guardarImagen();
  }

  private async cargarImagenes() {
    const storedImages = await Preferences.get({ key: this.IMAGENES_KEY });
    this.imagenes = storedImages && storedImages.value ? JSON.parse(storedImages.value) : [];
  }

  private async guardarImagen() {
    await Preferences.set({
      key: this.IMAGENES_KEY,
      value: JSON.stringify(this.imagenes)
    });
  }
}
