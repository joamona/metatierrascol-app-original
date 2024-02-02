import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import {Documento} from "../models/documento.model";
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

@Injectable({
  providedIn: 'root',
})
export class DocumentoService {
  private readonly PREFERENCES_KEY = 'listaDocumentos';
  private readonly FOLDER_NAME = 'MetaTierras';
  private readonly FILE_NAME = 'listaDocumentos.json';
  private documentos: Documento[] = [];
  private contadorId = 0;
  /*private async cargarListaDocumentosDesdeStorage() {
    const listaDocumentosGuardada = await Preferences.get({ key: this.PREFERENCES_KEY });

    if (listaDocumentosGuardada && listaDocumentosGuardada.value) {
      this.documentos = JSON.parse(listaDocumentosGuardada.value);
    }
  }*/

  private async cargarListaDocumentos() {
    const listaDocumentosGuardada = await Preferences.get({ key: this.PREFERENCES_KEY });

    if (listaDocumentosGuardada && listaDocumentosGuardada.value) {
      this.documentos = JSON.parse(listaDocumentosGuardada.value);
    }
  }
  obtenerSiguienteId(): number {
    this.contadorId++;
    return this.contadorId;
  }
  actualizarDocumento(index: number, documento: Documento) {
    this.documentos[index] = documento;
    this.guardarListaDocumentos();
  }
  private async guardarListaDocumentos() {
    await Preferences.set({
      key: this.PREFERENCES_KEY,
      value: JSON.stringify(this.documentos),
    });
  }
  addDocumento(documento: Documento) {
    this.documentos.push(documento);
  }


  getDocumentos(): Documento[] {
    return this.documentos;
  }


  eliminarDocumento(index: number) {
    if (index >= 0 && index < this.documentos.length) {
      this.documentos.splice(index, 1);
    }
  }
}
