import { Box, BoxProps, Button, Card, Grid, IconButton, TextField, Typography} from '@mui/material';
import type { FeatureCollection } from 'geojson';
import { useCounter } from 'src/hooks/useCounter';
import { Fragment,useState } from 'react';
import Steppers from 'src/components/steppers';
import Swal from 'sweetalert2'
import { styled } from '@mui/material/styles'
import Icon from "src/@core/components/icon"
import RenderMap from './renderMap';
import { useService } from 'src/hooks/useService';
import { useMutation, useQueryClient } from 'react-query';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';

interface Props {
  toggle: () => void
  title:string
}
const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default
}))
const steps = [{
  title:'Rutas'
},
{
  title:'Paradas'
},
{
  title:'Nombre'
}
]
const geoDeafult:FeatureCollection = {
  type: "FeatureCollection",
features:[]
}
const Maps = ({toggle,title}:Props)=>{
  const {count, increment, decrement} = useCounter(0)
  const [geojsonR,setGeojsonR] = useState<FeatureCollection>(geoDeafult)
  const [geojsonS, setGeojsonS] = useState<FeatureCollection>(geoDeafult)
  const [zoom,setZoom] = useState<number>(2)
  const [center,setCenter] = useState<[lat:number,lng:number]>([0,0])
  const [name,setName] = useState<string>('')
  const {Post}=useService()
  const queryClient = useQueryClient()
  const mutation = useMutation((Data:object)=>Post('/road',Data),{
    onSuccess:()=>{
      queryClient.invalidateQueries('roads');
    }
  })
  const handleCancel=()=>{
    if(geojsonR.features.length !==0 || geojsonS.features.length !==0)
    {
      Swal.fire({
        title: '¿Quieres descartar los cambios?',
        text: '¡No se guardaran los cambios realizados!',
        icon: "warning",
        showCancelButton: true,
        cancelButtonColor: "#3085d6",
        confirmButtonText: 'Descartar Cambios'
      }).then((result) => {
        if (result.isConfirmed) {
          setGeojsonR(geoDeafult)
          setGeojsonS(geoDeafult)
          toggle()
        }
      });
    }else{
      toggle()
    }
  }
  const handleOmited = ()=>{
    if(geojsonS.features.length !==0)
    {
      Swal.fire({
        title: '¿Quieres omitir sin guardar los cambios?',
        icon: "warning",
        showCancelButton: true,
        cancelButtonColor: "#3085d6",
        confirmButtonText: 'Omitir de todos modos',
        cancelButtonText:'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          setGeojsonS(geoDeafult)
          increment()
        }
      });
    }else{increment()}
  }
  const handleClose = () => {
    if(geojsonR.features.length !==0 || geojsonS.features.length !==0){
      Swal.fire({
        title: '¿Estas seguro de cerrar sin guardar?',
        icon: "warning",
        showCancelButton: true,
        cancelButtonColor: "#3085d6",
        confirmButtonColor:'red',
        confirmButtonText: 'Cerrar sin guardar',
        cancelButtonText:'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          toggle()
        }
      });
    }else{toggle()}
  }
  const onSubmit =()=>{
    const getData = ()=>{
      return{
        geojsonR,
        geojsonS,
        zoom,
        center,
        name
      }
    }
    mutation.mutate(getData())
  }
 
    if(mutation.isError){
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text:'Hubo un error al guardar los datos, conexion de base de datos fallida o variables de entorno no son correctos',
      });
    }
    if(mutation.isSuccess)
    {
      Swal.fire({
        title: '¡Éxito!',
        text: 'Datos guardados exitosamente',
        icon: "success"
      });
      toggle()
    }
 
  const getStepContent = (step: number)=>{
    switch (step) {
      case 0:
        return (
               <Fragment key={step}>
                <Grid item xs={12} sm={12}>
                  <RenderMap 
                  geojson={geojsonR}
                  setGeojson={setGeojsonR}
                  zoom={zoom}
                  center={center}
                  setZoom={setZoom}
                  setCenter={setCenter}
                  polyline={true}
                  marker={false}
                  />
                </Grid>
                </Fragment>
            )
            case 1:
              return (
                     <Fragment key={step}>
                      <Grid item xs={12} sm={12}>
                        <RenderMap
                        geojson={geojsonS}
                        setGeojson={setGeojsonS}
                        zoom={zoom}
                        center={center}
                        setCenter={setCenter}
                        setZoom={setZoom}
                        polyline={false}
                        marker={true}
                        />
                      </Grid>
                      </Fragment>
                  )
            case 2: 
            return(
              <Fragment>
                <Grid item xs={12} sm={12}>
                <TextField
                fullWidth
                label='Nombre de ruta'
                placeholder='ruta y parada 110'
                value={name}
                onChange={e => setName(e.target.value)}
              />
                </Grid>
              </Fragment>
            )
        default: return 'Unknown Step'
    }
  }
  return (
  <Card>
    <Header>
    <Typography variant='h6'>{title}</Typography>
    <IconButton size='small' onClick={handleClose} sx={{ color: 'text.primary' }}>
      <Icon icon='mdi:close' fontSize={20} />
      </IconButton>
  </Header>
    <Steppers 
    activeStep={count}
    steps={steps}
    >
      <Grid container spacing={5}>
        {getStepContent(count)}
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            size='large'
            variant='outlined'
            color='secondary'
            disabled={count === 0 || mutation.isLoading}
            onClick={decrement}
          >
            Atras
          </Button>
          <Box sx={{ flex: '1 1 auto' }} />
          <Button size='large' variant='outlined' 
          disabled={mutation.isLoading}
          onClick={count ===1?handleOmited:handleCancel} color='secondary' sx={{mr:1}}>
            {count === 1? 'Omitir': 'Cancelar'}</Button>
          {mutation.isLoading?
                <LoadingButton
                loading
                loadingPosition="start"
                startIcon={<SaveIcon />}
                variant="outlined"
              >
                Guardando...
              </LoadingButton>:
          <Button size='large' 
          variant={'contained'} 
          onClick={count === steps.length-1?onSubmit:increment}
          startIcon={count === steps.length-1 || mutation.isLoading?<SaveIcon/>:''} 
          >
            {count === steps.length - 1 ?'Guardar' : 'Siguiente'}
          </Button>}
        </Grid>
      </Grid>
    </Steppers>
    </Card>
  )
  }
export default Maps