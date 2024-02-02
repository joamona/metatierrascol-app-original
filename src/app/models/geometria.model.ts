export class Coordenadas{
  x: number
  y: number
  precisionX: number
  precisionY: number
  num: number
  cod: string
  origen: string

  constructor(x: number, y: number, precisionX: number, precisionY: number, num: number = 0, cod: string = '--', origen: string) {
    this.x = x;
    this.y = y;
    this.precisionX = precisionX;
    this.precisionY = precisionY;
    this.num = num;
    this.cod = cod;
    this.origen = origen;
  }

}
