import { Box, Card, CardHeader, CircularProgress, Grid, Typography } from '@mui/material'
import dynamic from 'next/dynamic'
import { useMemo, useState } from 'react'
const Monitoreo = () => {
  
  const [zoom, setZoom] = useState<number>(2)
  const [center, setCenter] = useState<[lat: number, lng: number]>([0, 0])
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
        <Card>
        <Box sx={{padding:4, backgroundColor:theme=>`${theme.palette.primary.main}`, color:'white'}}>Rutas</Box>
        <Map zoom={zoom} center={center} />
        </Card>
      </Grid>
    </Grid>
  )
}
export default Monitoreo
