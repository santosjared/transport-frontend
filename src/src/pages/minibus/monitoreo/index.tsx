import { Box, Button, Card, CardHeader, CircularProgress, Grid, Typography } from '@mui/material'
import dynamic from 'next/dynamic'
import { useEffect, useMemo, useState } from 'react'
import ListRoad from './list'
import { useMutation } from 'react-query'
import { useService } from 'src/hooks/useService'
const Monitoreo = () => {

  const [zoom, setZoom] = useState<number>(2)
  const [center, setCenter] = useState<[lat: number, lng: number]>([0, 0])
  const [hidden1, setHidden1] = useState('flex')
  const [hidden2, setHidden2] = useState('none')
  const [id,setId] = useState('')
  const [open,setOpen] = useState(false)
  const [geojson, setGeojson] = useState()
  const {GetId} = useService()

  // if(navigator.geolocation){
  // navigator.geolocation.getCurrentPosition((position)=>{
  //   setCenter([position.coords.latitude, position.coords.longitude])
  //   setZoom(13)
  // })}
  const handleDraw = () =>setOpen(!open)
  const handleHidden = () =>
  {
    setHidden1('none')
    setHidden2('flex')
  }
  const handleOpenRoad = () =>{
    handleDraw()
  }
  console.log(geojson)
  const Map = useMemo(
    () =>
      dynamic(() => import('src/components/map'), {
        loading: () => {
          return (
            <Box>
              <CircularProgress sx={{ mb: 4 }} />
              <Typography>Cargando mapa...</Typography>
            </Box>
          )
        },
        ssr: false
      }),
    []
  )
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card >
        <Box sx={{padding:4, backgroundColor:theme=>`${theme.palette.primary.main}`, color:'white'}}>Todos</Box>
        <Map zoom={zoom} center={center}/>
        <Box sx={{display:`${hidden1}`, alignItems:'center', justifyContent:'center', padding:2}}>
          <Button size='large' variant='contained' sx={{mr:3}}>Minibus cerca de mi</Button>
          <Button size='large' variant='contained' onClick={handleOpenRoad}>rutas</Button>
        </Box>
        <Box sx={{display:`${hidden2}`, alignItems:'center', justifyContent:'center', padding:2}}>
          <Button size='large' variant='contained' sx={{mr:3}}>Horarios</Button>
          <Button size='large' variant='contained' sx={{mr:3}}>Tarifas</Button>
          <Button size='large' variant='contained' sx={{mr:3}}>Paradas</Button>
        </Box>
        </Card>
        <ListRoad onClose={handleDraw} open={open} handleHidden={handleHidden} setId = {setId}/>
      </Grid>
    </Grid>
  )
}
export default Monitoreo
