import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

import { Controller, useForm } from "react-hook-form"
import Box from '@mui/material/Box'

import FormControl from "@mui/material/FormControl"
import TextField from "@mui/material/TextField"
import FormHelperText from "@mui/material/FormHelperText"
import Button from "@mui/material/Button"
import { useService } from 'src/hooks/useService';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Autocomplete } from '@mui/material';
import { ChangeEvent, useState } from 'react';

interface Props {
  toggle: () => void
}
interface Data {
  name: string
  routs: string
  schedule: string
}
const defaultValues = {
  name: '',
  routs: '',
  schedule: '',
}
const AddLinea = ({ toggle }: Props) => {

  const [onSelect, setOnSelect] = useState<any>(null)
  const [name,setName] = useState('')

  const { Post, Get } = useService()
  const queryClient = useQueryClient()
  const routs = useQuery('road', () => Get('/road'))
  const schedules = useQuery('schedules', () => Get('/horario'))
  const tarifa = useQuery('tarifa',()=> Get('/tarifa'))
  const mutation = useMutation((Data: object) => Post('/linea', Data), {
    onSuccess: () => {
      queryClient.invalidateQueries('lineas');
    }
  })

  const handleNameOnchange = (e:ChangeEvent<HTMLInputElement>) =>{
    setName(e.target.value)
  }
  const handleClose = () => {
    toggle()
  }
  const Routs = () => {
    if (routs.isError || routs.isLoading) return [{ name: '' }]
    return routs.data?.data
  }
  const Schulede = () => {
    if (schedules.isError || schedules.isLoading) return [{ name: '' }]
    return schedules.data?.data
  }
  const Tarifa = () =>{
    if (tarifa.isError || tarifa.isLoading) return [{name:''}]
    return tarifa.data?.data
  }
  return (
    <Box sx={{ border: '1px solid #EEEDED', borderRadius: 1, p: 5 }}>
      <FormControl fullWidth sx={{ mb: 6 }}>
        <TextField label='Nombre de la linea'
          placeholder='Linea 110'
          value={name}
          onChange={handleNameOnchange}
        />
      </FormControl>
      <FormControl fullWidth sx={{ mb: 6 }}>
        <Autocomplete
          options={Routs()}
          getOptionLabel={Routs().name}
          onChange={(event, value) => setOnSelect(value)}
          renderInput={(params) => (
            <TextField
              {...params}
              label='Asignar rutas y paradas'
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <>
                    {params.InputProps.startAdornment}
                  </>
                )
              }}
            />

          )}
          sx={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
        >

        </Autocomplete>
      </FormControl>
      <FormControl fullWidth sx={{ mb: 6 }}>
        <Autocomplete
          options={Schulede()}
          getOptionLabel={Schulede().name}
          onChange={(event, value) => setOnSelect(value)}
          renderInput={(params) => (
            <TextField
              {...params}
              label='Asignar Horarios'
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <>
                    {params.InputProps.startAdornment}
                  </>
                )
              }}
            />

          )}
          sx={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
        >
        </Autocomplete>
      </FormControl>
      <FormControl fullWidth sx={{ mb: 6 }}>
        <Autocomplete
          options={Tarifa()}
          getOptionLabel={Tarifa().name}
          onChange={(event, value) => setOnSelect(value)}
          renderInput={(params) => (
            <TextField
              {...params}
              label='Asignar Tafrifa'
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <>
                    {params.InputProps.startAdornment}
                  </>
                )
              }}
            />

          )}
          sx={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
        >
        </Autocomplete>
      </FormControl>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button size='large' type='submit' variant='contained' sx={{ mr: 3 }} startIcon={<SaveIcon />}>
          Guardar
        </Button>
        <Button size='large' variant='outlined' color='secondary' onClick={handleClose} startIcon={<CancelIcon />}>
          Cancel
        </Button>
      </Box>
    </Box>
  )
}
export default AddLinea
