import { Button } from '@mui/material';
import dynamic from 'next/dynamic';
import { useMemo} from 'react';
import { useDispatch } from 'react-redux';
import AddDrawMap from 'src/components/addDrawMap';
import { AppDispatch } from 'src/store';
import { desasignedRoad } from 'src/store/apps/linea';
import Swal from 'sweetalert2';

interface Props{
    data:any
    id:string
    onClose:() => void;
}
const ViewMap = ({id,data,onClose}:Props)=>{
  const Map = useMemo(() => dynamic(
    () => import('../../../../components/map'),
    { 
      loading: () => <p>Cargando la mapa...</p>,
      ssr: false
    }
  ), [data])
  const dispatch = useDispatch<AppDispatch>()
  const handleDesasingned = async () =>{
        const confirme = await Swal.fire({
          title: '¿Estas seguro de desasignar la ruta?',
          icon: "warning",
          showCancelButton: true,
          cancelButtonColor: "#3085d6",
          cancelButtonText:'Cancelar',
          confirmButtonText: 'confirmar',
        }).then(async(result)=>{return await result.isConfirmed});
        if(confirme)
        {
            dispatch(desasignedRoad(id)).then((result)=>{
              if(result.payload){
                Swal.fire({
                  title: '¡Éxito!',
                  text: 'ruta desasignado exitosamente',
                  icon: "success"
                });
                onClose()
              }
            })
        }

  }
    return(
        <AddDrawMap 
        title={data.name}
        toggle={onClose}
        >
          <Button variant='contained' sx={{mb:6, ml:3}} onClick={handleDesasingned}>desasignar ruta</Button>
          <Map 
          center={data.center}
          geoJSON={data.geojson}
          >
          </Map>
        </AddDrawMap>
    )
}
export default ViewMap