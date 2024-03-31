import dynamic from 'next/dynamic';
import { useMemo} from 'react';
import { useService } from 'src/hooks/useService';
import { useQuery } from 'react-query';
import { Box } from '@mui/material';
import AddDrawMap from 'src/components/addDrawMap';

interface Props{
    id:string | number;
    onClose:() => void;
}
const ViewMap = ({id,onClose}:Props)=>{
    const {GetId} = useService()
    const {data,isLoading,isError} = useQuery('roads',() =>GetId('/road',id))
  const Map = useMemo(() => dynamic(
    () => import('../../../../components/map'),
    { 
      loading: () => <p>Cargando la mapa...</p>,
      ssr: false
    }
  ), [])
    return(
        <AddDrawMap 
        title={`Ruta de la linea ${data?.data.name}`}
        toggle={onClose}
        >
        {isLoading?<Box sx={{textAlign:'center'}}>Cargando la mapa...</Box>:!isError?
          <Map 
          center={data?.data.center}
          zoom={data?.data.zoom}
          geoJSON={data?.data.geojsonR}
          >
          </Map>:''
        }
        </AddDrawMap>
    )
}
export default ViewMap