import { Box, Button, Card, CardHeader, FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField } from "@mui/material"
import { Controller } from "react-hook-form"
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { useService } from "src/hooks/useService";
import { useMutation, useQueryClient } from "react-query";
import { ChangeEvent, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import type { FeatureCollection } from 'geojson';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useSocket } from "src/hooks/useSocket";

interface Props {
  toggle: () => void
}
const Register = ({ toggle }: Props) => {

  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [user, setUser] = useState('');
  const [key, setKey] = useState('');
  const [showKey, setShowKey] = useState(false)
  
  const {socket} =useSocket()
  const { Post } = useService()
  const mutation = useMutation((Data: object) => Post('/divice', Data), {
    onSuccess: () => {
      socket?.emit('datadivice')
    }
  })
  const handleSaveOnclick = ()=>{
    const data = {
      name:name,
      brand:brand,
      user:user,
      key:key
    }
    mutation.mutate(data)
    toggle()
  }
  return (
    <Box>
      <fieldset style={{ border: '1.5px solid #EEEDED', borderRadius: 10, padding:'4%'}}>
        <legend style={{ textAlign: 'center'}}>Crear Credenciales</legend>
        <FormControl fullWidth sx={{ mb: 6 }}>
          <TextField
            label='Nombre'
            placeholder='gps 012'
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </FormControl>
        <FormControl fullWidth sx={{ mb: 6 }}>
          <TextField
            label='Marca del dispositivo'
            onChange={(e) => setBrand(e.target.value)}
            value={brand}
          />
        </FormControl>
        <FormControl fullWidth sx={{ mb: 6 }}>
          <TextField
            label='Usuario'
            onChange={(e) => setUser(e.target.value)}
            value={user}
          />
        </FormControl>
        <FormControl fullWidth sx={{ mb: 6 }}>
          <InputLabel htmlFor="outlined-adornment-password">Clave</InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={showKey ? 'text' : 'password'}
            value={key}
            onChange={(e) => setKey(e.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowKey((prevShow) => !prevShow)}
                  edge="end"
                >
                  {showKey ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Clave"
          />
        </FormControl>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button size='large' variant='outlined' color='secondary' onClick={() => toggle()} startIcon={<CancelIcon />}>
            Cancel
          </Button>
          <Button size='large' type='submit' variant='contained' sx={{ mr: 3 }} onClick={handleSaveOnclick}
            startIcon={<SaveIcon />}>
            Guardar
          </Button>
        </Box>
      </fieldset>
    </Box>
  )
}
export default Register