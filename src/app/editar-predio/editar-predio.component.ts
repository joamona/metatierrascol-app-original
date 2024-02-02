import {Component, OnInit} from '@angular/core';
import {GeometriasService} from "../services/GeometriasService";
import {mapDraw} from "../mapa/mapDraw";
import { ActivatedRoute } from '@angular/router';
import {PredioService} from "../services/PredioService";
import {CONFIG_OPENLAYERS} from "../configuracion-openlayers";
import {Modify, Select} from "ol/interaction";
import {click} from "ol/events/condition";
import Polygon from "ol/geom/Polygon";
import { Router } from '@angular/router';
import {Coordenadas} from "../models/geometria.model";
import Swal from "sweetalert2";


@Component({
  selector: 'app-editar-predio',
  templateUrl: './editar-predio.component.html',
  styleUrl: './editar-predio.component.css'
})
export class EditarPredioComponent implements OnInit{

  titulo: string =  "Editar Predio ";
  predioActual = this.predioService.obtenerPredioActual();
  constructor(private predioService: PredioService, private geometriasService: GeometriasService, private route: ActivatedRoute, private router: Router) {
  }
  protected readonly mapDraw = mapDraw;


  ngOnInit(): void {
    mapDraw.clearVectorLayerDigital();
    this.route.params.subscribe(params => {
      const predioId = +params['id'];
      this.cargarPredio(predioId);
    });
  }

  private cargarPredio(predioId: number) {
    const predioSeleccionado = this.predioService.getListaPredios().find(predio => predio.id === predioId);
    if (predioSeleccionado) {
      this.predioActual = predioSeleccionado;
      this.titulo += this.predioActual.id;
      this.getCoordPredio();
    } else {
      console.error('Predio no encontrado con ID:', predioId);
    }
  }
  private getCoordPredio() {

    this.route.params.subscribe(params => {
      let predioIdFromRoute = +params['id'];

      let predioSeleccionado = this.predioService.getListaPredios().find(predio => predio.id === predioIdFromRoute);

      if (predioSeleccionado ) {
        let coordenadas = predioSeleccionado.geometrias;
        console.log("las coord del predio son: ", coordenadas)
        this.waitForMapInitialization().then(() => {
          this.agregarCoordenadasAlMapa(this.extraerCoords([coordenadas]));
        });
      }
    });


  }

  private waitForMapInitialization(): Promise<void> {
    return new Promise<void>((resolve) => {
      // Verifica cada 100 ms si el mapa está inicializado
      const checkInitialization = () => {
        if (CONFIG_OPENLAYERS.MAP) {
          clearInterval(intervalId);
          resolve();
        }
      };

      const intervalId = setInterval(checkInitialization, 100);
      checkInitialization(); // Comprueba la inicialización inmediatamente
    });
  }

  private extraerCoords(coordenadas: Coordenadas[][]): number[][] {
    let arrayXY = [];

    for (let subArray of coordenadas) {
      for (let coords of subArray) {
        console.log("Coordenada actual:", coords);

        let x = Number(coords.x);
        let y = Number(coords.y);

        console.log("Tipo de X:", typeof x, "X:", x);
        console.log("Tipo de Y:", typeof y, "Y:", y);

        if (!isNaN(x) && !isNaN(y)) {
          arrayXY.push([x, y]);
        } else {
          console.error("Coordenada no válida:", coords);
        }
      }
    }

    console.log("Coordenadas extraídas:", arrayXY);
    return arrayXY;
  }





  /*private agregarCoordenadasAlMapa(arrayXY: number[][]) {
    // Agrega las coordenadas al mapa
    mapDraw.addPolygonToLayer(arrayXY);
    mapDraw.disableDrawings()

  }*/

  private agregarCoordenadasAlMapa(arrayXY: number[][]) {
    // Verifica si hay coordenadas válidas
    if (arrayXY.length > 0 && arrayXY[0].length > 1) {
      // Agrega las coordenadas al mapa
      mapDraw.addPolygonToLayer(arrayXY);
      mapDraw.disableDrawings();

      // Crea una extensión que contenga todas las coordenadas
      const extent = new Polygon([arrayXY]).getExtent();

      // Hace zoom al mapa para que se ajuste a la extensión de las coordenadas
      CONFIG_OPENLAYERS.MAP.getView().fit(extent, {
        duration: 1000, // Duración en milisegundos para la animación del zoom
        padding: [50, 50, 50, 50] // Espacio extra alrededor de las coordenadas en píxeles
      });
    } else {
      console.warn("No se encontraron coordenadas válidas para hacer zoom");
    }
  }


  private obtenerPredioPorId(predioId: number) {
    return this.predioService
      .getListaPredios()
      .find((predio) => predio.id === predioId);
  }
  editarVertices() {
    const select = new Select({
      condition: click,
    });
    const modify = new Modify({
      features: select.getFeatures(),
    });

    CONFIG_OPENLAYERS.MAP.addInteraction(select);
    CONFIG_OPENLAYERS.MAP.addInteraction(modify);

    modify.on('modifyend', (evt) => {
      const modifiedFeature = evt.features.getArray()[0];
      if (modifiedFeature) {
        const geometry = modifiedFeature.getGeometry();
        if (geometry instanceof Polygon) {
          const coordinates = geometry.getCoordinates()[0];
          console.log('Polígono:', coordinates);

          const coordenadas = this.geometriasService.mapearCoordenadasPoligono(
            coordinates
          );
          this.geometriasService.agregarGeometria(coordenadas);

          // Actualizar las coordenadas en el predio
          const predioActual = this.obtenerPredioPorId(
            this.getCurrentPredioId()
          );
          if (predioActual) {
            predioActual.geometrias = coordenadas;
            console.log('Predio actual después de editar geometrías: ', predioActual);
          } else {
            console.error(
              'No se pudo obtener el predio actual después de editar geometrías.'
            );
          }
        }
      }

      mapDraw.disableDrawings();
    });
  }
  private getCurrentPredioId(): number {
    return +this.route.snapshot.params['id'];
  }

  editarDatos() {
    // Obtén el ID del predio actual
    let predioId = this.getCurrentPredioId();

    // Navega a la pantalla de edición de datos del predio
    this.router.navigate(['/editar-datos-predio', predioId]);
  }

  borrar() {
    Swal.fire({
      title: 'Confirmación',
      text: "¿Está seguro de que desea borrar el predio actual?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.predioService.borrarPredioActual();
        this.router.navigate(['/editar-predio-lista']);
      }
    });
  }



}
