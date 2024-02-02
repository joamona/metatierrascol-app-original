import Map from 'ol/Map';
import Draw from 'ol/interaction/Draw';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';

export class CONFIG_OPENLAYERS {
  public static MAP: Map;
  public static MAP_DRAW_POLYGON: Draw;
  public static MAP_DRAW_POINT: Draw;
  public static MAP_DRAW_LINE: Draw;
  public static SOURCE_DRAW_GPS: VectorSource = new VectorSource({ wrapX: false });
  public static VECTOR_DRAW_GPS: VectorLayer<VectorSource> = new VectorLayer({ source: CONFIG_OPENLAYERS.SOURCE_DRAW_GPS });
  /*public static SOURCE_DRAW: VectorSource = new VectorSource({wrapX: false});
  public static VECTOR_DRAW: VectorLayer<VectorSource> = new VectorLayer({ source: CONFIG_OPENLAYERS.SOURCE_DRAW });*/
  public static SOURCE_DRAW_DIGITAL: VectorSource = new VectorSource({ wrapX: false });
  public static VECTOR_DRAW_DIGITAL: VectorLayer<VectorSource> = new VectorLayer({ source: CONFIG_OPENLAYERS.SOURCE_DRAW_DIGITAL });

  public static REFERENCE_SYSTEMS = [
    { code: 'EPSG:4326', name: 'WGS 84' },
    /*{ code: 'EPSG:3857', name: 'Pseudo-Mercator' },
    { code: 'EPSG:25830', name: 'ETRS89 / UTM zona 30N' },*/
  ];
}
