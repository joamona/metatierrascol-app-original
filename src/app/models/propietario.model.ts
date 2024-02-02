export enum CR_InteresadoTipo {
  Persona_Natural = 'Persona Natural',
  Persona_Juridica = 'Persona Jurídica',
}
export interface Departamento {
  id: number;
  departamento: string;
}
export interface Provincia {
  id: number;
  provincia: string;
}
export interface Municipio {
  id: number;
  departamento: string;
  provincia: string;
  codigo_municipio: number;
  nombre_municipio: string;
}

export enum CR_DocumentoTipo {
  Cedula_Ciudadania = 'Cédula de Ciudadanía',
  Cedula_Extranjeria = 'Cédula de Extranjería',
  NIT = 'NIT',
  Tarjeta_Identidad = 'Tarjeta_Identidad',
  Registro_Civil = 'Registro_Civil',
  Secuencial = 'Secuencial',
  Pasaporte = 'Pasaporte'
}

export enum CR_SexoTipo {
  Masculino = 'Masculino',
  Femenino = 'Femenino',
  Sin_Determinar = 'Sin Determinar'
}

export enum Grupo_Etnico {
  Indigena = 'Indígena',
  Rrom = 'Rrom',
  Raizal = 'Raizal',
  Palenquero = 'Palenquero',
  Negro_Afrocolombiano = 'Negro_Afrocolombiano',
  Ninguno = 'Ninguno'
}
export enum Estado {
  Casado = 'Casado',
  Soltero = "Soltero"
}
export class Propietario {
  autorizaProcesamientoDatosPersonales: boolean;
  tipo: CR_InteresadoTipo;
  tipoDocumento: CR_DocumentoTipo;
  documentoIdentidad: string;
  primerNombre: string;
  segundoNombre?: string;
  primerApellido: string;
  segundoApellido?: string;
  sexo: CR_SexoTipo;
  grupoEtnico: Grupo_Etnico;
  telefono1: string;
  telefono2: string;
  correoElectronico: string;
  autorizaNotificacionCorreo: boolean;
  departamento: string;
  municipio: string;
  notas: string;
  porcentajePropiedad: number;
  estado: Estado;

  constructor(
    autorizaProcesamientoDatosPersonales: boolean,
    tipo: CR_InteresadoTipo,
    tipoDocumento: CR_DocumentoTipo,
    documentoIdentidad: string,
    primerNombre: string,
    segundoNombre: string,
    primerApellido: string,
    segundoApellido: string,
    sexo: CR_SexoTipo,
    grupoEtnico: Grupo_Etnico,
    telefono1: string,
    telefono2: string,
    correoElectronico: string,
    autorizaNotificacionCorreo: boolean,
    departamento: string,
    municipio: string,
    notas: string,
    porcentajePropiedad: number,
    estado: Estado
  ) {
    this.autorizaProcesamientoDatosPersonales = autorizaProcesamientoDatosPersonales;
    this.tipo = tipo;
    this.tipoDocumento = tipoDocumento;
    this.documentoIdentidad = documentoIdentidad;
    this.primerNombre = primerNombre;
    this.segundoNombre = segundoNombre;
    this.primerApellido = primerApellido;
    this.segundoApellido = segundoApellido;
    this.sexo = sexo;
    this.grupoEtnico = grupoEtnico;
    this.telefono1 = telefono1;
    this.telefono2 = telefono2;
    this.correoElectronico = correoElectronico;
    this.autorizaNotificacionCorreo = autorizaNotificacionCorreo;
    this.departamento = departamento;
    this.municipio = municipio;
    this.notas = notas;
    this.porcentajePropiedad = porcentajePropiedad;
    this.estado = estado;
  }
}
