export enum LC_PredioTipo {
  Baldio = "Baldio",
  Fiscal_Patrimonial = "Fiscal_Patrimonial",
  Uso_Publico = "Uso_Publico",
  Publico = "Publico",
  Privado = "Privado"
}

export enum SectorPredio {
  Norte = "Norte",
  Sur = "Sur",
  Este = "Este",
  Oeste = "Oeste"
}

export class DatosPredio {
  nombre: string;
  departamento: string;
  provincia: string;
  sectorPredio: SectorPredio;
  municipio: string;
  vereda: string;
  numeroPredial: string;
  numero_catastral: string;
  tipo: LC_PredioTipo;
  longitud: string;
  latitud: string;
  complemento: string;


  constructor(nombre: string, departamento: string, 
        provincia: string, sectorPredio: SectorPredio, municipio: string, 
        vereda: string, numeroPredial: string, numero_catastral:string,
        tipo: LC_PredioTipo, 
        complemento: string, longitud?:string, latitud?:string) {
    this.nombre = nombre;
    this.departamento = departamento;
    this.provincia = provincia;
    this.sectorPredio = sectorPredio;
    this.municipio = municipio;
    this.vereda = vereda;
    this.numeroPredial = numeroPredial;
    this.numero_catastral =numero_catastral;
    this.tipo = tipo;
    this.longitud = longitud || '';
    this.latitud = latitud || '';
    this.complemento = complemento;

  }
}
