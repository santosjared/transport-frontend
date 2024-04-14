import { Box, Button, Card, CardHeader, FormControl, FormHelperText, TextField } from "@mui/material"
import { Controller } from "react-hook-form"
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { useService } from "src/hooks/useService";
import { useMutation, useQueryClient } from "react-query";
import { ChangeEvent, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import type { FeatureCollection } from 'geojson';

interface Data {
  name:string
  brand:string,
  model:string,
  key:string,
  lat:number,
  lng:number
}
interface Props {
  data:Data
  toggle:()=>void
  setInfo:(value:boolean) =>void
}
const Register = ({data, toggle,setInfo}:Props)=>{

  const geojson:FeatureCollection = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Point',
          coordinates: [data.lng,data.lat],
        },
      },
    ],
  };

  const { Post} = useService()
  const queryClient = useQueryClient()
  const mutation = useMutation((Data: object) => Post('/divice', Data), {
    onSuccess: () => {
      queryClient.invalidateQueries('divice')
    }
  })
  const Map = useMemo(() => dynamic(
    () => import('../../../../components/map'),
    { 
      loading: () => <p>Cargando la Mapa</p>,
      ssr: false
    }
  ), [])
  const handleOnclickCancel = () =>{
    toggle()
    setInfo(false)
  }
    return(
        <Box>
        <FormControl fullWidth sx={{mb:6}}>
            <TextField
            disabled
            label='Nombre' 
            placeholder='gps 012'
            value={data.name}
            />
        </FormControl>
        <FormControl fullWidth sx={{mb:6}}>
            <TextField
            disabled
            label='Marca' 
            value={data.brand}
            />
        </FormControl>
        <FormControl fullWidth sx={{mb:6}}>
            <TextField
            disabled
            label='Modelo' 
            value={data.model}
            />
        </FormControl>
        <Box padding={2}>
          <Map zoom={16} center={[data.lat,data.lng]} geoJSON={geojson}/>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button size='large' type='submit' variant='contained' sx={{ mr: 3 }}
            onClick={handleOnclickCancel}
            >
              Aceptar
            </Button>
          </Box>
        </Box>
    )
}
export default Register