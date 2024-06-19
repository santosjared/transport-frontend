import dynamic from 'next/dynamic';
import { useMemo} from 'react';
import type { FeatureCollection } from 'geojson';
import { LatLng } from 'leaflet';

interface Props{
  location:any
    geojson: FeatureCollection;
    center: [number, number];
    setCenter:(position: LatLng | null)=>void;
    setZoom:(zoom:number)=>void
    setGeojson: (geojson: FeatureCollection) => void;
}
const RenderMap = ({geojson,setGeojson,center,setCenter,setZoom,location}:Props)=>{
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
          >
            <DrawMap 
            geojson={geojson}
            setGeojson={setGeojson}
            />
          </Map>
    )
}
export default RenderMap