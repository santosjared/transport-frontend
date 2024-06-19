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
import { useService } from 'src/hooks/useService'
import ListStatusConnect from './statusconnect'
import AnalyticsSalesCountry from './report'

const Monitoreo = () => {
  const [open, setOpen] = useState(false)
  const [openTarifa,setOpenTarifa] = useState(false)
  const [openHorario,setOpenHorario] = useState(false);
  const [onSelect, setOnSelect] = useState(false)
  const [lineaId,setLineaId] = useState<string | null>(null)
  const [LineaOne,setLineaOne] = useState<any>(null)
  const { error, location } = useGeolocation()
  const toggle = () => {
    if(!open){
      setLineaOne(null)
      setLineaId(null)
    }
    setOpen(!open)
  }
  const toggleTarifa = () => setOpenTarifa(!openTarifa)
  const toggleHorario = () => setOpenHorario(!openHorario)
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.linea)
  const {GetId}= useService()

  useEffect(() => {
    dispatch(fetchData())
  }, [dispatch])

  useEffect(()=>{
    if(lineaId){
    const fetch =async()=>{
      const response = await GetId('/linea',lineaId)
      setLineaOne(response.data)
    }
    fetch()
  }
  },[lineaId])
  const handleSelectLinea = async (id: string) => {
    setOnSelect(true)
    setLineaId(id)
    toggle()
  }

  const onclickHome = ()=>{
    dispatch(fetchData())
    setOnSelect(false)
    setLineaId(null)
  }

  const Map = useMemo(() => dynamic(() => import('src/components/realtimeMap'), { ssr: false }), [location, lineaId, LineaOne])

  return (
    <Grid container spacing={5}>
      <Grid item xs={12} sm={3}>
        <Grid container spacing={2} sx={{ backgroundColor: '#ff4040', padding: 2 }}>
          <Grid item xs={7}>
            <Grid container>
              <Grid item xs={4}><Icon icon='ph:warning' fontSize={40} style={{ color: '#fff' }} /></Grid>
              <Grid item xs={8}><Typography sx={{ color: '#fff' }}>Velocidad alta</Typography></Grid>
            </Grid>
          </Grid>
          <Grid item xs={5}>
          <Typography sx={{ color: '#fff'}}> mas de 30km/h</Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} sm={3}>
        <Grid container spacing={2} sx={{ backgroundColor: '#ff7c39', padding: 2 }}>
          <Grid item xs={7}>
            <Grid container>
              <Grid item xs={4}><Icon icon='cbi:air-presure' fontSize={40} style={{ color: '#fff' }} /></Grid>
              <Grid item xs={8}><Typography sx={{ color: '#fff' }}>Velocidad Moderado</Typography></Grid>
            </Grid>
          </Grid>
            <Grid item xs={5}>
                <Typography sx={{ color: '#fff'}}>mas de 20km/h</Typography>
              </Grid>
            </Grid>
        </Grid>
      <Grid item xs={12} sm={3}>
        <Grid container spacing={2} sx={{ backgroundColor: '#45a749', padding: 2 }}>
          <Grid item xs={7}>
            <Grid container>
              <Grid item xs={4}><Icon icon='mdi:car-brake-low-pressure' fontSize={40} style={{ color: '#fff' }} /></Grid>
              <Grid item xs={8}><Typography sx={{ color: '#fff' }}>Velocidad Seguro</Typography></Grid>
            </Grid>
          </Grid>
          <Grid item xs={5}><Typography sx={{ color: '#fff'}}> mas de 8km/h </Typography>
              </Grid>
          </Grid>
      </Grid>
      <Grid item xs={12} sm={3} >
        <Grid container spacing={2} sx={{ backgroundColor: '#4040fb', padding: 2 }}>
          <Grid item xs={7}>
            <Grid container>
              <Grid item xs={4}><Icon icon='line-md:speedometer-loop' fontSize={40} style={{ color: '#fff' }} /></Grid>
              <Grid item xs={8}><Typography sx={{ color: '#fff' }}>Velocidad lenta</Typography></Grid>
            </Grid>
          </Grid>
              <Grid item xs={5}><Typography sx={{ color: '#fff', textAlign: 'center' }}>menos de 8km/h</Typography>
              </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} sm={12} md={8}>
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
          <Map center={LineaOne && LineaOne.road?LineaOne.road.center:location?[location.latitude, location.longitude]:[0,0]} id={lineaId}/>

        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
          <AnalyticsSalesCountry linadta={LineaOne} />
      </Grid>
      <Grid item xs={12}>
        <Card>
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
