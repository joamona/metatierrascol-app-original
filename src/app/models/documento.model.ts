export enum DocTypeEnum {
  DNI = 'DNI',
  Escritura = 'Escritura',
  Declaracion = 'Declaración',
}
export class Documento {
  id: number;
  tipo_doc: DocTypeEnum;
  notas: string;
  imagenes: string[];
  pdfs: File[];

  constructor(id: number, tipo_doc: DocTypeEnum, notas: string, imagenes: string[], pdfs: File[]) {
    this.id = id;
    this.tipo_doc = tipo_doc;
    this.notas = notas;
    this.imagenes = imagenes;
    this.pdfs = pdfs || [];
  }
}

