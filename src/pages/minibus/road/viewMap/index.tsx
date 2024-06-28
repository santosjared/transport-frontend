import { Box, Card, CardContent, Divider, Typography } from '@mui/material';
import dynamic from 'next/dynamic';
import { Fragment, useMemo} from 'react';
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
          <Box sx={{display:'flex', justifyContent:'center', mt:6, mb:6}}>
            <Card sx={{width:400}}>
              <CardContent>
            <Typography variant='body1'> Rutas</Typography>
            <Divider/>
            {data.routes.map((value:string)=>(
              <Fragment key={value}>
                <Typography variant='body2'> {value}</Typography>
                <Divider/>
              </Fragment>
            ))}
            </CardContent>
            </Card>
          </Box>

        </AddDrawMap>
    )
}
export default ViewMap
