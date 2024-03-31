import dynamic from 'next/dynamic';
import { useMemo} from 'react';
import Location from '../location';
import type { FeatureCollection } from 'geojson';

interface Props{
    geojson: FeatureCollection;
    center:[lat:number,lng:number];
    zoom:number;
    polyline:boolean;
    marker:boolean;
    setCenter:(cooordenate:[lat:number,lng:number])=>void;
    setZoom:(zoom:number)=>void
    setGeojson: (geojson: FeatureCollection) => void;
}
const RenderMap = ({geojson,setGeojson,center,zoom,setCenter,setZoom,polyline,marker}:Props)=>{
  const DrawMap = useMemo(()=>dynamic(()=>import('../drawMap')),[geojson])
  const Map = useMemo(() => dynamic(
    () => import('../../../../components/map'),
    { 
      loading: () => <p>Cargando la Mapa</p>,
      ssr: false
    }
  ), [center,zoom])
    return(
          <Map 
          center={center}
          zoom={zoom}
          >
            <DrawMap 
            geojson={geojson}
            setGeojson={setGeojson}
            polyline={polyline}
            marker={marker}
            />
            <Location
            setCenter={setCenter}
            setZoom={setZoom}
            />
          </Map>
    )
}
export default RenderMap