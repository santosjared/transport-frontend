import { Box, BoxProps, Button, Card, CardContent, Checkbox, Divider, FormControl, Grid, IconButton, LinearProgress, TextField, Typography } from '@mui/material';
import type { FeatureCollection } from 'geojson';
import { FormEvent, Fragment, useEffect, useState } from 'react';
import Swal from 'sweetalert2'
import { styled } from '@mui/material/styles'
import Icon from "src/@core/components/icon"
import RenderMap from './renderMap';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/store';
import { addRoad } from 'src/store/apps/road';
import useGeolocation from 'src/hooks/useGeoLocation';
import { LatLng } from 'leaflet';
import ClearIcon from '@mui/icons-material/Clear';

interface Props {
  toggle: () => void
  title: string
}

const defaultErrors = {
  geojson: '',
  center: '',
  zoom: '',
  name: '',
  place: '',
  parada: '',
  lugar: ''
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
const Maps = ({ toggle, title }: Props) => {
  const [geojson, setGeojson] = useState<FeatureCollection>(geoDeafult)
  const [zoom, setZoom] = useState<number>(16)
  const [center, setCenter] = useState<LatLng | null>(null)
  const [name, setName] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [formErrors, setFormErrors] = useState(defaultErrors)
  const [names, setNames] = useState<string[]>([])
  const [isProcessingQueue, setIsProcessingQueue] = useState(false)
  const [lugar, setLugar] = useState('')

  const dispatch = useDispatch<AppDispatch>()
  const { error, location } = useGeolocation()
  const handleAddLugar = () => {
    if (!lugar) {
      setFormErrors(prevErrors => ({
        ...prevErrors,
        lugar: 'El campo no puede estar vacío'
      }))
      return
    }
    setNames(prevNames => [...prevNames, lugar])
    setLugar('')
  }

  const handleRemoveRoads = (index: number) => {
    setNames(prevNames => prevNames.filter((_, i) => i !== index))
  }

  const handleCancel = () => {
    if (geojson.features.length !== 0) {
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

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    geojson.features.map((value, index)=>{
      if(value.geometry){
        if(value.geometry.type === 'LineString'){
          value.properties={}
        }
      }
    })
    const data = {
      geojson: geojson,
      zoom: zoom,
      center: center ? [center.lat, center.lng] : location ? [location.latitude, location.longitude] : [0, 0],
      name: name,
      routes: names
    }
    try {
      const response = await dispatch(addRoad(data))
      if (response.payload.success) {
        Swal.fire({ title: '¡Éxito!', text: 'Datos guardados exitosamente', icon: "success" });
        handleReset()
      } else {
        if (response.payload.data) {
          const { data } = response.payload
          setFormErrors(prevErrors => ({
            ...prevErrors,
            name: data?.name,
            center: data?.center,
            geojson: data?.geojson,
            parada: data?.parada,
            place: data?.place,
            zoom: data?.zoom,
          }))
        } else { Swal.fire({ title: '¡Error!', text: 'ocurio un error al guardar los datos', icon: "error" }); handleReset() }
      }
    } catch (error) {
      Swal.fire({ title: '¡Error!', text: 'ocurio un error al guardar los datos', icon: "error" });
      handleReset()
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setName('')
    setGeojson(geoDeafult)
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
        <Grid container spacing={3}>
          <Grid item xs={12} sm={8}>
            <RenderMap
              names={names}
              setNames={setNames}
              isProcessingQueue={isProcessingQueue}
              setIsProcessingQueue={setIsProcessingQueue}
              geojson={geojson}
              setGeojson={setGeojson}
              center={location ? [location.latitude, location.longitude] : [0, 0]}
              setCenter={setCenter}
              setZoom={setZoom}
              location={location}
            />
          </Grid>
          <Grid item xs={12} sm={4} sx={{ p: 3, ml: { xs: 3, sm: 0 }, mt:3 }}>
            <FormControl fullWidth sx={{ mb: 6 }}>
              <TextField
                label='Nombre de la ruta'
                value={name}
                disabled={isProcessingQueue}
                error={Boolean(formErrors.name)}
                helperText={formErrors.name}
                autoComplete='off'
                onChange={e => {
                  setName(e.target.value)
                  setFormErrors(prevErrors => ({ ...prevErrors, name: '' }))
                }}
              />
            </FormControl>
            <Grid container spacing={2}>
              <Grid item xs={12} sx={{ mb: 3 }}>
                <Typography variant='body1'>{isProcessingQueue ? 'Encontrando lugares...' : 'Lugar'}</Typography>
                {isProcessingQueue && <LinearProgress />}
              </Grid>
            </Grid>
            <Grid item xs={12}>
              {names.map((value, index) => (
                <Grid key={index} container spacing={2}>
                  {value && <Fragment>
                    <Grid item xs={8}>
                      <Typography variant='body2'>{value}</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <IconButton size='medium' sx={{ color: 'text.primary', top: -6 }} onClick={() => handleRemoveRoads(index)}>
                        <ClearIcon />
                      </IconButton>
                    </Grid>
                    <Grid item xs={12}>
                      <Divider />
                    </Grid>
                  </Fragment>}
                </Grid>
              ))}
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <TextField
                      label='Lugar'
                      placeholder='Avenida san clemente'
                      value={lugar}
                      disabled={isProcessingQueue}
                      autoComplete='off'
                      onChange={e => {
                        setLugar(e.target.value)
                        setFormErrors(prevErrors => ({ ...prevErrors, lugar: '' }))
                      }}
                      error={Boolean(formErrors.lugar)}
                      helperText={formErrors.lugar}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
                  <Button onClick={handleAddLugar} disabled={isProcessingQueue} variant='outlined' sx={{pt:4,pb:4}}>Agregar</Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button size='large' variant='outlined' color='secondary' disabled={isProcessingQueue} onClick={handleCancel} startIcon={<CancelIcon />}>
                  Cancelar
                </Button>
                <Button size='large' type='submit' variant='contained' disabled={isProcessingQueue} sx={{ mr: 3 }} startIcon={<SaveIcon />}>
                  Guardar
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </Card>
  )
}

export default Maps
