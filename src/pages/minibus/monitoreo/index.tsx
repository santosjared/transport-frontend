import { Box, Button, Card, CardHeader, Grid, Typography } from '@mui/material'
import dynamic from 'next/dynamic'
import { useCallback, useMemo, useState } from 'react'
import ListRoad from './list'
import { useService } from 'src/hooks/useService'
import useGeolocation from 'src/hooks/useGeoLocation'
import Icon from 'src/@core/components/icon'
import { useQuery } from 'react-query'
import TableHeader from 'src/components/tableHeader'


const Monitoreo = () => {
  const [hidden1, setHidden1] = useState('flex')
  const [hidden2, setHidden2] = useState('none')
  const [id, setId] = useState('')
  const [open, setOpen] = useState(false)
  const { GetId } = useService()
  const { error, location } = useGeolocation()
  const handleDraw = () => setOpen(!open)
  const handleHidden = () => {
    setHidden1('none')
    setHidden2('flex')
  }
  const handleOpenRoad = () => {
    handleDraw()
  }
  const [pageSize,setPageSize]=useState<number>(10)
  const [value, setValue] = useState<string>('')
  const [OpenAdd, setOpenAdd] = useState<boolean>(false)
  const {Get}=useService()
  const {data,isLoading,isError} = useQuery('roads',()=>Get('/road'))
  const handleFilter = useCallback((val: string) => {
      setValue(val)
  },[])
  const toggleDrawer = () => setOpenAdd(!OpenAdd)
  const Map = useMemo(() => dynamic(() => import('src/components/realtimeMap'), { ssr: false }), [location])
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
        <CardHeader title='Monitoreo de Microbuses' sx={{pb:0, '& .MuiCardHeader-title':{letterSpacing:'.15px'}}} />
                    <TableHeader 
                    value={value} 
                    handleFilter={handleFilter} 
                    toggle={toggleDrawer}  
                    placeholder='Busquedad de micros'
                    title='ver rutas'
                    disable={isError || isLoading}
                    />
          {/* <Box sx={{ padding: 4, backgroundColor: theme => `${theme.palette.primary.main}`, color: 'white' }}>Todos</Box> */}
          <Box sx={{width:'100%', height:2, backgroundColor:theme => `${theme.palette.primary.main}`}}/>
          <Map center={[location.latitude, location.longitude]} />
          {/* <Box sx={{ display: `${hidden1}`, alignItems: 'center', justifyContent: 'center', padding: 2 }}>
            <Button size='large' variant='contained' sx={{mr:3}}>Minibus cerca de mi</Button> 
            <Button size='large' variant='contained' onClick={handleOpenRoad}>rutas</Button>
          </Box> */}
          <Box sx={{ display: `${hidden2}`, alignItems: 'center', justifyContent: 'center', padding: 2 }}>
            <Button size='large' variant='contained' sx={{ mr: 3 }}>Horarios</Button>
            <Button size='large' variant='contained' sx={{ mr: 3 }}>Tarifas</Button>
            <Button size='large' variant='contained' sx={{ mr: 3 }}>Paradas</Button>
          </Box>
        </Card>
        <ListRoad onClose={handleDraw} open={open} handleHidden={handleHidden} setId={setId} />
      </Grid>
    </Grid>
  )
}
export default Monitoreo
