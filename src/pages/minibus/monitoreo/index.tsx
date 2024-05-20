import { Avatar, Box, Button, ButtonGroup, Card, CardHeader, ChipProps, FormControl, Grid, IconButton, Tab, Tabs, TextField, Typography } from '@mui/material'
import dynamic from 'next/dynamic'
import { useCallback, useEffect, useMemo, useState } from 'react'
import useGeolocation from 'src/hooks/useGeoLocation'
import Icon from 'src/@core/components/icon'
import ListLinea from './Dialog'
import { RootState, AppDispatch } from 'src/store'
import { fetchData} from 'src/store/apps/linea'
import { useDispatch, useSelector } from 'react-redux'
import HomeIcon from '@mui/icons-material/Home';
import ListTarifa from './tarifas'
import ListHorario from './horario'
import {fetchData as fetchDataChoferes} from 'src/store/apps/licence-driver'
import { useService } from 'src/hooks/useService'
import ListStatusConnect from './statusconnect'

const Monitoreo = () => {
  const [open, setOpen] = useState(false)
  const [openTarifa,setOpenTarifa] = useState(false)
  const [openHorario,setOpenHorario] = useState(false);
  const [onSelect, setOnSelect] = useState(false)
  const [linea,setLinea] = useState<any[]>([])

  const { error, location } = useGeolocation()
  const toggle = () => setOpen(!open)
  const toggleTarifa = () => setOpenTarifa(!openTarifa)
  const toggleHorario = () => setOpenHorario(!openHorario)
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.linea)
  const {GetId}= useService()

  useEffect(() => {
    dispatch(fetchData())
    dispatch(fetchDataChoferes())
  }, [dispatch])

  useEffect(()=>{
    setLinea(store.data)
  },[store.data, onSelect])

  const handleSelectLinea = async (id: string) => {
    setOnSelect(true)
    const respose = await GetId('/linea',id)
    setLinea([respose.data])
    toggle()
  }

  const onclickHome = ()=>{
    dispatch(fetchData())
    setOnSelect(false)
  }

  const Map = useMemo(() => dynamic(() => import('src/components/realtimeMap'), { ssr: false }), [location, linea])

  return (
    <Grid container spacing={5}>
      <Grid item xs={3}>
        <Grid container spacing={2} sx={{ backgroundColor: '#ff4040', padding: 2 }}>
          <Grid item xs={7}>
            <Grid container>
              <Grid item xs={4}><Icon icon='line-md:speedometer-loop' fontSize={50} style={{ color: '#fff' }} /></Grid>
              <Grid item xs={8}><Typography sx={{ color: '#fff' }}>Velocidad Riesgoso</Typography></Grid>
            </Grid>
          </Grid>
          <Grid item xs={5}>
            <Grid container>
              <Grid item xs={12}><Typography sx={{ color: '#fff', textAlign: 'center' }}>120km/h</Typography></Grid>
              <Grid item xs={12}><Typography sx={{ color: '#fff', textAlign: 'Center' }}><Icon icon='bx:downvote' /></Typography></Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={3}>
        <Grid container spacing={2} sx={{ backgroundColor: '#ff7c39', padding: 2 }}>
          <Grid item xs={7}>
            <Grid container>
              <Grid item xs={4}><Icon icon='line-md:speedometer-loop' fontSize={50} style={{ color: '#fff' }} /></Grid>
              <Grid item xs={8}><Typography sx={{ color: '#fff' }}>Velocidad Moderado</Typography></Grid>
            </Grid>
          </Grid>
          <Grid item xs={5}>
            <Grid container>
              <Grid item xs={12}><Typography sx={{ color: '#fff', textAlign: 'center' }}>60km/h</Typography></Grid>
              <Grid item xs={12}><Typography sx={{ color: '#fff', textAlign: 'center' }}><Icon icon='bx:downvote' /></Typography></Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={3}>
        <Grid container spacing={2} sx={{ backgroundColor: '#4040fb', padding: 2 }}>
          <Grid item xs={7}>
            <Grid container>
              <Grid item xs={4}><Icon icon='line-md:speedometer-loop' fontSize={50} style={{ color: '#fff' }} /></Grid>
              <Grid item xs={8}><Typography sx={{ color: '#fff' }}>Velocidad Normal</Typography></Grid>
            </Grid>
          </Grid>
          <Grid item xs={5}>
            <Grid container>
              <Grid item xs={12}><Typography sx={{ color: '#fff', textAlign: 'center' }}>30km/h </Typography></Grid>
              <Grid item xs={12}><Typography sx={{ color: '#fff', textAlign: 'center' }}>
                <Icon icon='icon-park-outline:left-two' />
                <Icon icon='icon-park-outline:right-two' /></Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={3}>
        <Grid container spacing={2} sx={{ backgroundColor: '#45a749', padding: 2 }}>
          <Grid item xs={7}>
            <Grid container>
              <Grid item xs={4}><Icon icon='line-md:speedometer-loop' fontSize={50} style={{ color: '#fff' }} /></Grid>
              <Grid item xs={8}><Typography sx={{ color: '#fff' }}>Velocidad Seguro</Typography></Grid>
            </Grid>
          </Grid>
          <Grid item xs={5}>
            <Grid container>
              <Grid item xs={12}><Typography sx={{ color: '#fff', textAlign: 'center' }}>15km/h</Typography></Grid>
              <Grid item xs={12}><Typography sx={{ color: '#fff', textAlign: 'center' }}><Icon icon='mdi:car-brake-low-pressure' /></Typography></Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Card >
          <CardHeader title='Monitoreo de Microbuses' sx={{ pb: 0, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }} />
          <Box sx={{ p: 5, pb: 3, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            {onSelect ?
            <ButtonGroup aria-label="Basic button group">
              <IconButton onClick={onclickHome}><HomeIcon/></IconButton>
              <Button variant='text' onClick={toggleTarifa}>Tarifas</Button>
              <Button variant='text' onClick={toggleHorario}>Horarios</Button>
            </ButtonGroup>:
              <Button sx={{ mb: 2 }} onClick={toggle} variant='contained'>rutas y paradas</Button>
            }
          </Box>
          <Box sx={{ width: '100%', height: 1.5, backgroundColor: '#E0E0E0' }} />
          <Map center={[location.latitude, location.longitude]} linea={linea}/>
          <ListStatusConnect/> 
        </Card>               
      </Grid>
      <ListLinea open={open} toggle={toggle} data={store.data} handleSelectionLine={handleSelectLinea} />
      <ListTarifa open={openTarifa} toggle={toggleTarifa} data={onSelect?store.data[0]:null}/>
      <ListHorario open={openHorario} toggle={toggleHorario} data={onSelect?store.data[0]:null}/>
    </Grid>
  )
}
export default Monitoreo
