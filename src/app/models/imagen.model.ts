export enum LC_FuenteAdministrativaTipo {
  Documento_Publico = "Documento Público",
  Escritura_Publica = "Escritura Pública",
  Sentencia_Judicial = "Sentencia Judicial",
  Acto_Administrativo = "Acto Administrativo",
  Sin_Documento = "Sin Documento",
  Croquis_Campo = "Croquis de Campo",
  Datos_Crudos = "Datos Crudos",
  Ortofoto = "Ortofoto",
  Informe_Tecnico = "Informe Técnico",
  Registro_Fotografico = "Registro Fotográfico",
  DNI = "DNI",
  Imagen_propietario = "Imagen del Propietario",
  Acuerdo_colindantes = "Acuerdo con Colindantes"

}
export class Imagen {
  tipo_doc : LC_FuenteAdministrativaTipo
  notas: string
  imageData: string | undefined //base64 de la imagen

  constructor(tipo_doc: LC_FuenteAdministrativaTipo, notas: string, imageData: string) {
    this.tipo_doc = tipo_doc
    this.notas = notas
    this.imageData = imageData
  }
}
