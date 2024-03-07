import { Box, BoxProps, Button, Card, Grid, IconButton, TextField, Typography} from '@mui/material';
import type { FeatureCollection } from 'geojson';
import Routs from './routs';
import { useCounter } from 'src/hooks/useCounter';
import { Fragment, useState } from 'react';
import Steppers from 'src/components/steppers';
import Stops from './maker';
import Swal from 'sweetalert2'
import { styled } from '@mui/material/styles'
import Icon from "src/@core/components/icon"
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
  const {count, increment, decrement,setCount} = useCounter(0)
  const [geojsonR,setGeojsonR] = useState<FeatureCollection>(geoDeafult)
  const [geojsonS, setGeojsonS] = useState<FeatureCollection>(geoDeafult)
  const [name,setName] = useState<string>('')

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
      title: '¿Quieres guardar los cambios?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      denyButtonText: 'No guardar',
      cancelButtonText:'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title:'Nombre de la ruta',
          input:'text',
          showCancelButton:true,
          cancelButtonText:'Cancelar',
          confirmButtonText:'Guardar',
          preConfirm: async (inputValue)=>{
            if(inputValue)
            {
              setName(inputValue)
              //guardar
              toggle()
            }else{
              Swal.showValidationMessage('Campo requerido: Debe ingresar el nombre')
            }
          }
        }).then((result)=>{
          if(result.isConfirmed){
            toggle()
          }
        })
      } else if (result.isDenied) {
        toggle()
      }
    });
  }else{
    toggle()
  }
  }
  const getStepContent = (step: number)=>{
    switch (step) {
      case 0:
        return (
               <Fragment key={step}>
                <Grid item xs={12} sm={12}>
                  <Routs 
                  geojson={geojsonR}
                  setGeojson={setGeojsonR}
                  />
                </Grid>
                </Fragment>
            )
            case 1:
              return (
                     <Fragment key={step}>
                      <Grid item xs={12} sm={12}>
                        <Stops 
                        geojson={geojsonS}
                        setGeojson={setGeojsonS}
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
                placeholder='Ruta de Linea 012'
                value={name}
                onChange={e => setName(e.target.value)}
              />
                </Grid>
              </Fragment>
            )
        default: return 'Unknown Step'
    }
  }
  
  if (count === steps.length) {
    return (
      <>Finish</>
    )
  } else {
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
    <form onSubmit={e => e.preventDefault()}>
      <Grid container spacing={5}>
        {getStepContent(count)}
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            size='large'
            variant='outlined'
            color='secondary'
            disabled={count === 0}
            onClick={decrement}
          >
            Atras
          </Button>
          <Box sx={{ flex: '1 1 auto' }} />
          <Button size='large' variant='outlined' onClick={count ===1?handleOmited:handleCancel} color='secondary' sx={{mr:1}}>
            {count === 1? 'Omitir': 'Cancelar'}</Button>
          <Button size='large' variant='contained' onClick={increment}>
            {count === steps.length - 1 ? 'Guardar' : 'Siguiente'}
          </Button>
        </Grid>
      </Grid>
    </form>
    </Steppers>
    </Card>
  )
  }
}
export default Maps