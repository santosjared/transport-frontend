import { Box, BoxProps, Button, Card, FormControl, Grid, IconButton, TextField, Typography } from '@mui/material';
import type { FeatureCollection } from 'geojson';
import { useCounter } from 'src/hooks/useCounter';
import { FormEvent, Fragment, useEffect, useState } from 'react';
import Steppers from 'src/components/steppers';
import Swal from 'sweetalert2'
import { styled } from '@mui/material/styles'
import Icon from "src/@core/components/icon"
import RenderMap from './renderMap';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/store';
import { addRoad, updateRoad } from 'src/store/apps/road';
import useGeolocation from 'src/hooks/useGeoLocation';
import { LatLng } from 'leaflet';

interface Props {
  toggle: () => void
  title: string
  data:any
}
const defaultErrors ={
  geojson:'',
  center:'',
  zoom:'',
  name:'',
}
const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default
}))
const geoDeafult: FeatureCollection = {
  type: "FeatureCollection",
  features: []
}
const MapsEdit = ({ toggle, title, data }: Props) => {
  const [geojson, setGeojson] = useState<FeatureCollection>(geoDeafult)
  const [zoom, setZoom] = useState<number>(16)
  const [center, setCenter] = useState<LatLng | null>(null)
  const [name, setName] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [formErrors,setFormErrors] = useState(defaultErrors)
  const [handleChanges, setHandleChanges] = useState(false)

  useEffect(()=>{
    setGeojson(data.geojson)
    setZoom(data.zoom)
    setName(data.name)
  },[data])
  const dispatch = useDispatch<AppDispatch>()
  const handleCancel = () => {
    if (handleChanges) {
      Swal.fire({
        title: '¿Quieres descartar los cambios?',
        text: '¡No se guardaran los cambios realizados!',
        icon: "warning",
        showCancelButton: true,
        cancelButtonColor: "#3085d6",
        confirmButtonText: 'Descartar Cambios',
        cancelButtonText: 'Seguir editando'
      }).then((result) => {
        if (result.isConfirmed) {
          handleReset()
        }
      });
    } else {
      handleReset()
    }
  }
  const onSubmit = async (e:FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const updatedata ={
      geojson:geojson,
      zoom:zoom,
      center:center?[center.lat,center.lng]:data.center,
      name:name
    }
    try {
      const response = await dispatch(updateRoad({data:updatedata,id:data.id}))
      if (response.payload.success) {
        Swal.fire({ title: '¡Éxito!', text: 'Datos actualizados exitosamente', icon: "success" });
        handleReset()
      } else {
        if (response.payload.data) {
          const { data } = response.payload
          formErrors.name = data.name
          setFormErrors(formErrors)
        } else { Swal.fire({ title: '¡Error!', text: 'ocurio un error al guardar los datos', icon: "error" }); handleReset() }
      }
    } catch (error) {
      Swal.fire({ title: '¡Error!', text: 'ocurio un error al guardar los datos', icon: "error" });
      handleReset()
    } finally {
      setFormErrors(formErrors)
      setIsLoading(false)
    }
   
  }
  const handleReset = () =>{
    setName('')
    setGeojson(geoDeafult)
    defaultErrors.name=''
    setFormErrors(defaultErrors)
    toggle()
  } 
  return (
    <Card>
      <Header>
        <Typography variant='h6'>{title}</Typography>
        <IconButton size='small' onClick={handleCancel} sx={{ color: 'text.primary' }}>
          <Icon icon='mdi:close' fontSize={20} />
        </IconButton>
      </Header>
      <form onSubmit={onSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12}>
          <RenderMap
            geojson={geojson}
            setGeojson={setGeojson}
            center={data.center}
            zoom = {data.zoom}
            setCenter={setCenter}
            setZoom={setZoom}
            setHandleChanges = {setHandleChanges}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <Box sx={{ pt: 3, pl: 10, pr: 10, pb: 10 }}>
            <FormControl fullWidth sx={{ mb: 6 }}>
              <TextField
                label='Nombre de la ruta'
                value={name}
                error={Boolean(formErrors.name)}
                helperText = {formErrors.name}
                onChange={e=>setName(e.target.value)}
              />
            </FormControl>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button size='large' variant='outlined' color='secondary' onClick={handleCancel} startIcon={<CancelIcon />}>
                Cancel
              </Button>
              <Button size='large' type='submit' variant='contained' sx={{ mr: 3 }} startIcon={<SaveIcon />}>
                Guardar
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
      </form>
    </Card>
  )
}
export default MapsEdit