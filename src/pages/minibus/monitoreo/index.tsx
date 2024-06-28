import { Avatar, Box, Button, ButtonGroup, Card, CardHeader, ChipProps, FormControl, Grid, IconButton, Menu, MenuItem, Tab, Tabs, TextField, Typography } from '@mui/material'
import dynamic from 'next/dynamic'
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import useGeolocation from 'src/hooks/useGeoLocation'
import Icon from 'src/@core/components/icon'
import ListLinea from './Dialog'
import { RootState, AppDispatch } from 'src/store'
import { fetchData } from 'src/store/apps/linea'
import { useDispatch, useSelector } from 'react-redux'
import MenuIcon from '@mui/icons-material/Menu';
import ListTarifa from './tarifas'
import ListHorario from './horario'
import { useService } from 'src/hooks/useService'
import ListStatusConnect from './statusconnect'
import AnalyticsSalesCountry from './report'
import ListRutas from './rutas'
import NearBus from './nearBus'

interface openOptins {
  all:string;
  roadm:string;
  roadr:string;
  busnear:string;
  rate:string;
  horario:string;
}
const options:openOptins = {
  all:'all',
  roadm:'roadm',
  roadr:'roadr',
  busnear:'busnear',
  rate:'rate',
  horario:'horario'
}
const Monitoreo = () => {
  const [open, setOpen] = useState(false)
  const [openTarifa, setOpenTarifa] = useState(false)
  const [openHorario, setOpenHorario] = useState(false);
  const [openRuta,setOpenRuta] = useState(false)
  const [lineaRoad, setLineaRoad] = useState<any>(null)
  const [LineaOne, setLineaOne] = useState<any>(null)
  const [openNearBus,setOpenNearBus] = useState(false)
  const [key, setKey] = useState<keyof openOptins>('all')
  const [subMenuAnchorEl, setSubMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [mainMenuAnchorEl, setMainMenuAnchorEl] = useState<null | HTMLElement>(null);
  const subMenuOpen = Boolean(subMenuAnchorEl);

  const handleSubMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setSubMenuAnchorEl(event.currentTarget);
  };

  const handleSubMenuClose = () => {
    setSubMenuAnchorEl(null);
  };

  const handleMainMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMainMenuAnchorEl(event.currentTarget);
  };

  const handleMainMenuClose = () => {
    setMainMenuAnchorEl(null);
  };
  const { error, location } = useGeolocation()
  const toggle = () =>setOpen(!open)
  const handleOpenOptions = (key: keyof openOptins)=>{
    if(key === options.all){
      dispatch(fetchData())
      setLineaRoad(null)
      return
    }
    if(key === options.busnear){
      toggleNearBus()
      return
    }
    setKey(key)
    toggle()
  }
  const toggleTarifa = () => setOpenTarifa(!openTarifa)
  const toggleHorario = () => setOpenHorario(!openHorario)
  const toggleRuta = () => setOpenRuta(!openRuta)
  const toggleNearBus = () =>setOpenNearBus(!openNearBus)
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.linea)
  const { GetId } = useService()

  useEffect(() => {
    dispatch(fetchData())
  }, [dispatch])

  // useEffect(() => {
  //   if (lineaId) {
  //     const fetch = async () => {
  //       const response = await GetId('/linea', lineaId)
  //       setLineaOne(response.data)
  //     }
  //     fetch()
  //   }
  // }, [lineaId])
  const handleSelectLinea = async (value: any, key: keyof openOptins) => {
    setLineaOne(value)
    if(key === options.horario){
      toggleHorario()
    }
    if(key === options.rate){
      toggleTarifa()
    }
    if(key === options.roadm){
      setLineaRoad(value)
    }
    if(key === options.roadr){
      toggleRuta()
    }
    await GetId('/linea', value.id)
    toggle()
  }

  const Map = useMemo(() => dynamic(() => import('src/components/realtimeMap'), { ssr: false }), [location, lineaRoad])

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
            <Typography sx={{ color: '#fff' }}> mas de 30km/h</Typography>
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
            <Typography sx={{ color: '#fff' }}>mas de 20km/h</Typography>
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
          <Grid item xs={5}><Typography sx={{ color: '#fff' }}> mas de 8km/h </Typography>
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
      <Card>
        <CardHeader
          title="Monitoreo de Microbuses"
          sx={{ pb: 0, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }}
        />
        <Box
          sx={{
            p: 5,
            pb: 3,
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: { xs: 'block', md: 'none' } }}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleMainMenuOpen}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={mainMenuAnchorEl}
              open={Boolean(mainMenuAnchorEl)}
              onClose={handleMainMenuClose}
            >
              <MenuItem onClick={() => { handleMainMenuClose(); handleOpenOptions('all'); }}>todos</MenuItem>
              <MenuItem
                onClick={handleSubMenuOpen}
              >
                rutas y paradas
                <Menu
                  anchorEl={subMenuAnchorEl}
                  open={subMenuOpen}
                  onClose={handleSubMenuClose}
                >
                  <MenuItem onClick={() => { handleSubMenuClose(); handleOpenOptions('roadm') }}>ver en mapa</MenuItem>
                  <MenuItem onClick={() => { handleSubMenuClose(); handleOpenOptions('roadr')}}>ver rutas</MenuItem>
                </Menu>
              </MenuItem>
              <MenuItem onClick={() => { handleMainMenuClose(); handleOpenOptions('busnear'); }}>Buses cercano</MenuItem>
              <MenuItem onClick={() => { handleMainMenuClose(); handleOpenOptions('rate'); }}>Tarifas</MenuItem>
              <MenuItem onClick={() => { handleMainMenuClose(); handleOpenOptions('horario'); }}>Horarios</MenuItem>
            </Menu>
          </Box>
          <ButtonGroup
            aria-label="Basic button group"
            sx={{ display: { xs: 'none', md: 'block' } }}
          >
            <Button variant="text" onClick={()=>handleOpenOptions('all')}>todos</Button>
            <Button
              variant="text"
              onClick={handleSubMenuOpen}
              aria-haspopup="true"
              aria-controls="submenu-rutas"
              aria-expanded={subMenuOpen ? 'true' : undefined}
            >
              rutas y paradas
            </Button>
            <Menu
              id="submenu-rutas"
              anchorEl={subMenuAnchorEl}
              open={subMenuOpen}
              onClose={handleSubMenuClose}
            >
              <MenuItem onClick={() => { handleSubMenuClose(); handleOpenOptions('roadm')}}>ver en mapa</MenuItem>
              <MenuItem onClick={() => { handleSubMenuClose(); handleOpenOptions('roadr') }}>ver rutas</MenuItem>
            </Menu>
            <Button variant="text" onClick={()=>handleOpenOptions('busnear')}>Buses cercano</Button>
            <Button variant="text" onClick={()=>handleOpenOptions('rate')}>Tarifas</Button>
            <Button variant="text" onClick={()=>handleOpenOptions('horario')}>Horarios</Button>
          </ButtonGroup>
        </Box>
        <Box sx={{ width: '100%', height: 1.5, backgroundColor: '#E0E0E0' }} />
        <Map center={lineaRoad && lineaRoad.road.length !==0 ? lineaRoad.road[0].center : location ? [location.latitude, location.longitude] : [0, 0]}
        id={lineaRoad&&lineaRoad.id}
        road={lineaRoad&&lineaRoad.road}
        />
      </Card>
    </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <AnalyticsSalesCountry linadta={LineaOne} />
      </Grid>
      <Grid item xs={12}>
        <Card>
          <ListStatusConnect />
        </Card>

      </Grid>

      <ListLinea open={open} toggle={toggle} data={store.data} handleSelectionLine={handleSelectLinea} options={key}/>
      <ListTarifa open={openTarifa} toggle={toggleTarifa} data={LineaOne} />
      <ListHorario open={openHorario} toggle={toggleHorario} data={LineaOne} />
      <ListRutas open={openRuta} toggle={toggleRuta} data={LineaOne}/>
      <NearBus open={openNearBus} toggle={toggleNearBus} linea={store.data}/>
    </Grid>
  )
}
export default Monitoreo
