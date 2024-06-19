import dynamic from 'next/dynamic';
import { useMemo} from 'react';
import AddDrawMap from 'src/components/addDrawMap';

interface Props{
    data:any
    onClose:() => void;
}
const ViewMap = ({data,onClose}:Props)=>{
  const Map = useMemo(() => dynamic(
    () => import('../../../../components/map'),
    { 
      loading: () => <p>Cargando la mapa...</p>,
      ssr: false
    }
  ), [data])
    return(
        <AddDrawMap 
        title={data.name}
        toggle={onClose}
        >
          <Map 
          center={data.center}
          geoJSON={data.geojson}
          >
          </Map>
        </AddDrawMap>
    )
}
export default ViewMap