import dynamic from 'next/dynamic';
import { useMemo} from 'react';
import type { FeatureCollection } from 'geojson';
import { LatLng } from 'leaflet';

interface Props{
  zoom:number
    geojson: FeatureCollection;
    center: [number, number];
    isProcessingQueue: boolean;
    names: string[];
    setIsProcessingQueue: (state: boolean) => void;
    setNames: (names: string[]) => void;
    setHandleChanges:(arg:boolean)=>void
    setCenter:(position: LatLng | null)=>void;
    setZoom:(zoom:number)=>void
    setGeojson: (geojson: FeatureCollection) => void;
}
const RenderMap = ({geojson,setGeojson,center,setCenter,setZoom,zoom,setHandleChanges,names,setNames,isProcessingQueue,setIsProcessingQueue}:Props)=>{
//   const DrawMap = useMemo(()=>dynamic(()=>import('../drawMap'),
//   {
//     loading: () => <p>Cargando la Mapa</p>,
//     ssr: false
//   }
// ),[geojson])
//   const Map = useMemo(() => dynamic(
//     () => import('../../../../components/map'),
//     {
//       loading: () => <p>Cargando la Mapa</p>,
//       ssr: false
//     }
//   ), [location])
    return(<></>
          // <Map
          // center={center}
          // setPosition={setCenter}
          // setZoom={setZoom}
          // zoom = {zoom}
          // setHandleChanges={setHandleChanges}
          // >
          //   <DrawMap
          //   names={names}
          //   setNames={setNames}
          //   isProcessingQueue={isProcessingQueue}
          //   geojson={geojson}
          //   setGeojson={setGeojson}
          //   setHandleChanges={setHandleChanges}
          //   />
          // </Map>
    )
}
export default RenderMap
