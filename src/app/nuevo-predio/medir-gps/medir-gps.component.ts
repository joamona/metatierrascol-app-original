import { Component } from '@angular/core';
import {mapDraw} from "../../mapa/mapDraw";
import {GeolocationService} from "../../services/Geolocation.service";
import {CONFIG_OPENLAYERS} from "../../configuracion-openlayers";
import {PredioService} from "../../services/PredioService";
import {GeometriasService} from "../../services/GeometriasService";
import {ImagenService} from "../../services/ImagenService";
import {Imagen, LC_FuenteAdministrativaTipo} from "../../models/imagen.model";
import {Coordenadas} from "../../models/geometria.model";
import {MatSnackBar} from "@angular/material/snack-bar";
import Swal from "sweetalert2";

@Component({
  selector: 'app-medir-gps',
  templateUrl: './medir-gps.component.html',
  styleUrl: './medir-gps.component.css'
})
export class MedirGpsComponent {

  protected readonly mapDraw = mapDraw;
  puntosMedidos: number = 0;
  imagenCapturada: string | undefined = '';
  precisiones: number[] = [];

  constructor(private geolocationService: GeolocationService, private geometriaService: GeometriasService,
              private predioService: PredioService, private imagenService: ImagenService, private snackBar: MatSnackBar) {}

  ngAfterViewInit(): void {
    let predioActual = this.predioService.obtenerPredioActual();

    // Verifica si hay geometrías existentes
    if (predioActual && predioActual.geometrias.length > 0) {
      Swal.fire({
        title: 'Confirmación',
        text: "Hay geometrías dibujadas para este predio. ¿Desea eliminarlas?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.isConfirmed) {
          this.geometriaService.limpiarGeometrias();
          predioActual.geometrias = [];
          mapDraw.clearVectorLayerDigital();
          mapDraw.clearVectorLayerGPS();
        }
      });
    } else {
      mapDraw.clearVectorLayerDigital();
      mapDraw.clearVectorLayerGPS();
    }
    // Espera a que el mapa esté listo antes de deshabilitar las interacciones de dibujo
    if (CONFIG_OPENLAYERS.MAP) {
      mapDraw.disableDrawings();
    }
  }
  centerMapToMyPosition() {
    this.geolocationService.getCurrentCoordinates().then(position => {
      let centro = CONFIG_OPENLAYERS.MAP.getView();
      centro.setCenter([position.coords.longitude, position.coords.latitude]);
      centro.setZoom(20);
      CONFIG_OPENLAYERS.MAP.setView(centro);
      console.log([position.coords.latitude, position.coords.longitude])
    }).catch(error => {
      console.error('Error al obtener la posición actual:', error);
      alert(`Error al obtener la ubicación: ${error.message}`);
    });
  }

  medirPunto() {
    this.geolocationService.getCurrentCoordinates().then(position => {
      // Extrae y limita la precisión a 4 decimales
      const precisionX = parseFloat(position.coords.accuracy.toFixed(4));
      const precisionY = parseFloat(position.coords.accuracy.toFixed(4));

      // Agrega el punto al mapa
      mapDraw.addPoint([position.coords.longitude, position.coords.latitude]);

      // Crea una nueva instancia de Coordenadas con la precisión
      let coordenada = new Coordenadas(
        position.coords.longitude,
        position.coords.latitude,
        precisionX,
        precisionY,
        0,
        '--',
        'GPS'
      );

      // Agrega la coordenada al servicio de geometrías
      this.geometriaService.agregarGeometria([coordenada]);

      // Actualiza la precisión para mostrarla en la interfaz de usuario
      this.precisiones.push(precisionX);
      this.puntosMedidos++;
    }).catch(error => {
      console.error('Error al obtener la posición actual:', error);
      alert(`Error al obtener la ubicación: ${error.message}`);
    });
  }



  borrarUltimoPunto() {
    if (this.puntosMedidos > 0) {
      mapDraw.removeLastPoint();
      this.puntosMedidos--;
      this.precisiones.pop();
    } else {
      this.snackBar.open('No hay puntos para borrar', 'Cerrar', { duration: 3000, verticalPosition: "top" });
    }
  }


  finalizarMedicion() {
    mapDraw.finishPolygon(this.geometriaService, this.predioService);
  }

  takePhoto() {
    this.imagenService.addNewToGallery().then((capturedPhoto) => {

      this.imagenCapturada = capturedPhoto.webPath;

      const nuevaImagen: Imagen = {
        tipo_doc: LC_FuenteAdministrativaTipo.Imagen_propietario,
        notas: '',
        imageData: this.imagenCapturada
      };

      let predioActual = this.predioService.obtenerPredioActual();
      predioActual.imagenes.push(nuevaImagen);
      this.predioService.guardarPredioActual(predioActual);
      console.log(predioActual);
    }).catch(error => {
      console.error("Error al tomar la foto:", error);
    });
  }

}
