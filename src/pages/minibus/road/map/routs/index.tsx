import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';
import Location from '../../location';
import type { FeatureCollection } from 'geojson';

interface Props{
    geojson: FeatureCollection;
    setGeojson: (geojson: FeatureCollection) => void;
}
const Routs = ({geojson,setGeojson}:Props)=>{
  const [center,setCenter] = useState<[lat:number,lng:number]>([0,0])
  const [zoom, setZoom] = useState<number>(2)
  const DrawMap = useMemo(()=>dynamic(()=>import('../../drawMap')),[geojson])
  const Map = useMemo(() => dynamic(
    () => import('../../../../../components/map'),
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
            polyline={true}
            marker={false}
            />
            <Location
            setCenter={setCenter}
            setZoom={setZoom}
            />
          </Map>
    )
}
export default Routs