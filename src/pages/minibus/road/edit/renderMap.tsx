import dynamic from 'next/dynamic';
import { useMemo} from 'react';
import type { FeatureCollection } from 'geojson';
import { LatLng } from 'leaflet';

interface Props{
  zoom:number
    geojson: FeatureCollection;
    center: [number, number];
    setHandleChanges:(arg:boolean)=>void
    setCenter:(position: LatLng | null)=>void;
    setZoom:(zoom:number)=>void
    setGeojson: (geojson: FeatureCollection) => void;
}
const RenderMap = ({geojson,setGeojson,center,setCenter,setZoom,zoom,setHandleChanges}:Props)=>{
  const DrawMap = useMemo(()=>dynamic(()=>import('../drawMap')),[geojson])
  const Map = useMemo(() => dynamic(
    () => import('../../../../components/map'),
    { 
      loading: () => <p>Cargando la Mapa</p>,
      ssr: false
    }
  ), [location])
    return(
          <Map 
          center={center}
          setPosition={setCenter}
          setZoom={setZoom}
          zoom = {zoom}
          setHandleChanges={setHandleChanges}
          >
            <DrawMap 
            geojson={geojson}
            setGeojson={setGeojson}
            setHandleChanges={setHandleChanges}
            />
          </Map>
    )
}
export default RenderMap