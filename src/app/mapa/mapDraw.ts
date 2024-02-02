import {CONFIG_OPENLAYERS} from "../configuracion-openlayers";
import Draw from "ol/interaction/Draw";
import Feature from "ol/Feature.js";
import Polygon from "ol/geom/Polygon.js";
import Point from 'ol/geom/Point';
import LineString from 'ol/geom/LineString';
import {GeometriasService} from "../services/GeometriasService";
import {PredioService} from "../services/PredioService";
import {Coordenadas} from "../models/geometria.model";


export class mapDraw {

  // Almacena los puntos medidos
  private static measuredPoints: number[][] = [];
  protected readonly predioService = PredioService;

  public static addDrawPolygonInteraction() {
    CONFIG_OPENLAYERS.MAP_DRAW_POLYGON = new Draw({
      source: CONFIG_OPENLAYERS.SOURCE_DRAW_DIGITAL,
      type:('Polygon')
    });
    CONFIG_OPENLAYERS.MAP.addInteraction(CONFIG_OPENLAYERS.MAP_DRAW_POLYGON);
  }
  public static addDrawPointInteraction() {
    CONFIG_OPENLAYERS.MAP_DRAW_POINT = new Draw({
      source: CONFIG_OPENLAYERS.SOURCE_DRAW_DIGITAL,
      type:('Point')
    });
    CONFIG_OPENLAYERS.MAP.addInteraction(CONFIG_OPENLAYERS.MAP_DRAW_POINT);
  }
  public static addDrawLineInteraction() {
    CONFIG_OPENLAYERS.MAP_DRAW_LINE = new Draw({
      source: CONFIG_OPENLAYERS.SOURCE_DRAW_DIGITAL,
      type:('LineString')
    });
    CONFIG_OPENLAYERS.MAP.addInteraction(CONFIG_OPENLAYERS.MAP_DRAW_LINE);
  }

  public static enableDrawPolygons(){
      this.disableDrawings();
      CONFIG_OPENLAYERS.MAP_DRAW_POLYGON.setActive(true);
  }

  public static enableDrawPoints(){
    this.disableDrawings();
    CONFIG_OPENLAYERS.MAP_DRAW_POINT.setActive(true);
  }

  public static enableDrawLine(){
    this.disableDrawings();
    CONFIG_OPENLAYERS.MAP_DRAW_LINE.setActive(true);
  }
  public static disableDrawings(){
    if (CONFIG_OPENLAYERS.MAP_DRAW_POLYGON) {
      CONFIG_OPENLAYERS.MAP_DRAW_POLYGON.setActive(false);
    }
    if (CONFIG_OPENLAYERS.MAP_DRAW_POINT) {
      CONFIG_OPENLAYERS.MAP_DRAW_POINT.setActive(false);
    }
    if (CONFIG_OPENLAYERS.MAP_DRAW_LINE) {
      CONFIG_OPENLAYERS.MAP_DRAW_LINE.setActive(false);
    }
  }

  public static clearVectorLayerDigital(){
    CONFIG_OPENLAYERS.SOURCE_DRAW_DIGITAL.clear();
  }
  public static clearVectorLayerGPS(){
    CONFIG_OPENLAYERS.SOURCE_DRAW_GPS.clear();
  }

  public static addPolygonToLayer(coordinates: number[][]) {
    console.log("las coordenadas que entran a la función addPolygonToLayer son:")
    console.log(coordinates)

    // Crea la geometría del polígono
    let polygonGeometry = new Polygon([coordinates]);

    // Crea la feature del polígono
    let polygonFeature = new Feature({
      geometry: polygonGeometry,
    });

    CONFIG_OPENLAYERS.SOURCE_DRAW_DIGITAL.addFeature(polygonFeature);
  }



  public static addPoint(coordinate: number[]) {
    this.measuredPoints.push(coordinate);

    // Crea un nuevo punto y lo añade a la fuente de vectores
    const pointFeature = new Feature(new Point(coordinate));
    CONFIG_OPENLAYERS.SOURCE_DRAW_GPS.addFeature(pointFeature);

    // Si hay más de un punto, dibuja una línea entre ellos
    if (this.measuredPoints.length > 1) {
      const lineFeature = new Feature(new LineString(this.measuredPoints));
      CONFIG_OPENLAYERS.SOURCE_DRAW_GPS.addFeature(lineFeature);
    }
  }


  public static removeLastPoint() {
    if (this.measuredPoints.length > 0) {
      this.measuredPoints.pop();
      // Actualiza la capa de vectores para reflejar el cambio
      this.updateVectorLayer();
    }
  }


  public static finishPolygon(geometriasService: GeometriasService, predioService: PredioService) {
    if (this.measuredPoints.length >= 3) {
      // Crea el polígono y lo añade a la capa
      const polygonFeature = new Feature(new Polygon([this.measuredPoints]));
      //CONFIG_OPENLAYERS.SOURCE_DRAW.clear();
      CONFIG_OPENLAYERS.SOURCE_DRAW_GPS.addFeature(polygonFeature);


      const coordenadas = geometriasService.mapearCoordenadasPoligono(this.measuredPoints);


      geometriasService.agregarGeometria(coordenadas);

      let predioActual = predioService.obtenerPredioActual();
      predioActual.geometrias.push(...coordenadas);

      predioService.guardarPredioActual(predioActual);

      // Reinicia el arreglo de puntos medidos
      this.measuredPoints = [];
    } else {
      console.error('Se necesitan al menos 3 puntos para crear un polígono.');
    }
  }

  // Actualiza la capa de vectores para reflejar cambios en los puntos medidos
  private static updateVectorLayer() {
    CONFIG_OPENLAYERS.SOURCE_DRAW_GPS.clear();
    this.measuredPoints.forEach(coordinate => {
      const pointFeature = new Feature(new Point(coordinate));
      CONFIG_OPENLAYERS.SOURCE_DRAW_GPS.addFeature(pointFeature);
    });

    if (this.measuredPoints.length > 1) {
      const lineFeature = new Feature(new LineString(this.measuredPoints));
      CONFIG_OPENLAYERS.SOURCE_DRAW_GPS.addFeature(lineFeature);
    }
  }

  public static initializeDrawingInteractions() {
    this.addDrawPolygonInteraction();
    this.addDrawPointInteraction();
    this.addDrawLineInteraction();
    this.disableDrawings();
  }


 /* public static limpiarGeometrias(geometriasParaMantener: Coordenadas[]) {
    // Convertir las coordenadas de geometriasParaMantener a strings para comparación
    const keepCoordsStrings = geometriasParaMantener.map(geom => `${geom.x},${geom.y}`);

    // Obtener todas las features del mapa
    const allFeatures = CONFIG_OPENLAYERS.SOURCE_DRAW.getFeatures();

    allFeatures.forEach(feature => {
      const geometry = feature.getGeometry();
      let featureCoordString = '';

      if (geometry instanceof Point) {
        const coords = geometry.getCoordinates();
        featureCoordString = `${coords[0]},${coords[1]}`;
      } else if (geometry instanceof LineString || geometry instanceof Polygon) {
        const coords = geometry.getCoordinates();
        featureCoordString = coords.map(coord => `${coord[0]},${coord[1]}`).join(';');
        console.log("en el featurecoordString hay: ",featureCoordString);
      }

      // Si la feature no se encuentra en keepCoordsStrings, se debe eliminar
      if (!keepCoordsStrings.includes(featureCoordString)) {
        CONFIG_OPENLAYERS.SOURCE_DRAW.removeFeature(feature);
        console.log("se elimina: ",feature);
      }
    });
  }*/



}
