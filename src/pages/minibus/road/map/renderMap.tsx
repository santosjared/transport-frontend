'use client'
import dynamic from 'next/dynamic';
import { useMemo} from 'react';
import type { FeatureCollection } from 'geojson';
import { LatLng } from 'leaflet';

interface Props{
  location:any
    geojson: FeatureCollection;
    center: [number, number];
  isProcessingQueue:boolean
  names:string[];
  setIsProcessingQueue:(state:boolean) => void;
  setNames:(names:string[]) =>void;
    setCenter:(position: LatLng | null)=>void;
    setZoom:(zoom:number)=>void
    setGeojson: (geojson: FeatureCollection) => void;
}
const RenderMap = ({geojson,setGeojson,center,setCenter,setZoom,location, names,setNames,isProcessingQueue,setIsProcessingQueue}:Props)=>{
  const DrawMap = useMemo(()=>dynamic(()=>import('src/components/drawMap'),{
    loading: () => <p>Cargando la Mapa</p>,
    ssr: false
  }),[])
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
            names={names}
            setNames={setNames}
            isProcessingQueue={isProcessingQueue}
            geojson={geojson}
            setGeojson={setGeojson}
            />
          </Map>
    )
}
export default RenderMap
