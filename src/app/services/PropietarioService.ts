import { Injectable } from '@angular/core';
import { Propietario } from '../models/propietario.model';
import { Preferences } from '@capacitor/preferences';
@Injectable({
  providedIn: 'root',
})
export class PropietarioService {
  private propietarios: Propietario[] = [];
  private readonly PREFERENCES_KEY = 'propietarios';
  constructor() {
    this.cargarPropietarios();
  }
  async addPropietario(propietario: Propietario) {
    this.propietarios.push(propietario);
    await this.guardarPropietarios();
  }

  async eliminarPropietario(documentoIdentidad: string) {
    this.propietarios = this.propietarios.filter((propietario) => propietario.documentoIdentidad !== documentoIdentidad);
    await this.guardarPropietarios();
  }
  getPropietarios(): Propietario[] {
    return this.propietarios;
  }


  getPropietarioPorDocumentoIdentidad(documentoIdentidad: string): Propietario | undefined {
    return this.propietarios.find(propietario => propietario.documentoIdentidad === documentoIdentidad);
  }

  async actualizarPropietario(propietario: Propietario) {
    let index = this.propietarios.findIndex((p) => p.documentoIdentidad === propietario.documentoIdentidad);

    if (index !== -1) {
      this.propietarios[index] = propietario;
      await this.guardarPropietarios();
    }
  }

  private async cargarPropietarios() {
    let propietariosAlmacenados = await Preferences.get({ key: this.PREFERENCES_KEY });
    this.propietarios = propietariosAlmacenados && propietariosAlmacenados.value
      ? JSON.parse(propietariosAlmacenados.value) : [];
  }
  private async guardarPropietarios() {
    await Preferences.set({
      key: this.PREFERENCES_KEY,
      value: JSON.stringify(this.propietarios),
    });
  }

  /*dniExists(dni: string): boolean {
    return this.propietarios.some(propietario => propietario.dni === dni);
  }*/
  documentoIdentidadExists(documentoIdentidad: string): boolean {
    return this.propietarios.some(propietario => propietario.documentoIdentidad === documentoIdentidad);
  }

}
