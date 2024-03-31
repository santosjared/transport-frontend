import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Cancel'

import { Controller, useForm } from 'react-hook-form'
import Box from '@mui/material/Box'

import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import FormHelperText from '@mui/material/FormHelperText'
import Button from '@mui/material/Button'
import { useService } from 'src/hooks/useService'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { Typography, Divider, Grid, Input, Card, IconButton } from '@mui/material'
import React, { ReactNode, useState } from 'react'
import Icon from "src/@core/components/icon"
import ClearIcon from '@mui/icons-material/Clear';

interface Props {
  toggle: () => void
}
interface InputsTarifa{
  name:string
  tarifa:string
}
interface Data {
  name: string
  tarifas: object
  description: string
}
const defaultValues = {
  name: '',
  tarifas: [],
  description: ''
}
const defaultTarifa = [
  {name:'Escolar',tarifa:'Bs. 0.50'},
  {name:'Universitario',tarifa:'Bs. 1'},
  {name:'Adulto',tarifa:'Bs. 1.50'},
  {name:'Tercera Edad',tarifa:'Bs. 1'},
]
const AddTarifas = ({ toggle }: Props) => {
  const [onSelect, setOnSelect] = useState<any>(null)
  const [addTarifa, setAddTarifa] = useState(defaultTarifa)
  const { Post, Get } = useService()
  const queryClient = useQueryClient()
  const mutation = useMutation((Data: object) => Post('/linea', Data), {
    onSuccess: () => {
      queryClient.invalidateQueries('lineas')
    }
  })
  const routs = useQuery('road', () => Get('/road'))
  const schedules = useQuery('schedules', () => Get('/horario'))
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<Data>({
    defaultValues
  })
  const handleAddTarifa = ()=>{
    setAddTarifa([...addTarifa,{name:'Nueva Tarifa', tarifa:'Bs. 0.00'}])
  }
  const handleRemoveTarifa = (index:number)=>{
    const newImputs = [...addTarifa]
    newImputs.splice(index, 1)
    setAddTarifa(newImputs)
  }
  const handleChangeTarifa = (value:string, index:number, key: keyof InputsTarifa) =>{
    const newInputs = [...addTarifa]
    newInputs[index][key] = value
    setAddTarifa(newInputs)
  }
  const onSubmit = async (data: Data) => {
    mutation.mutate({ data })
    toggle()
    reset()
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
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl fullWidth sx={{ mb: 3 }}>
        <Controller
          name='name'
          control={control}
          rules={{ required: true }}
          render={({ field: { value, onChange } }) => (
            <TextField
              value={value}
              label='Nombre tarifa'
              onChange={onChange}
              placeholder='Tarifa 012'
              error={Boolean(errors.name)}
            />
          )}
        />
        {errors.name && <FormHelperText sx={{ color: 'error.main' }}></FormHelperText>}
      </FormControl>
      <Divider>
        <Typography>Agregar tarifas</Typography>
      </Divider>
      {addTarifa.map((value,index)=>(
        <FormControl fullWidth sx={{mb:6}}>
          <Grid container spacing={1}>
            <Grid xs={7} mx={1}>
              <TextField label='Tipo Tarifa' value={value.name} variant='standard' onChange={(e)=>handleChangeTarifa(e.target.value, index,'name')} fullWidth />
            </Grid>
            <Grid xs={3} mx={1}>
              <TextField label='Tarifa' value={value.tarifa} variant='standard' onChange={(e)=>handleChangeTarifa(e.target.value, index, 'tarifa')} fullWidth />
            </Grid>
            <Grid xs = {1}>
              <IconButton size='medium' sx={{color:'text.primary', top: 15}} onClick={()=>handleRemoveTarifa(index)}>
                <ClearIcon/>
              </IconButton>
            </Grid>
          </Grid>
        </FormControl>
      ))}
      <Box sx={{display:'flex', alignItems:'center', justifyContent:'center', mb:6}}>
        <IconButton size='small' sx={{color:theme=>theme.palette.primary.main}} onClick={handleAddTarifa}>
            <Icon icon='zondicons:add-outline' fontSize={25}></Icon>
        </IconButton>
      </Box>
      <FormControl fullWidth sx={{ mb: 3 }}>
        <Controller
          name='description'
          control={control}
          rules={{ required: true }}
          render={({ field: { value, onChange } }) => (
            <TextField
              value={value}
              label='Descripción'
              onChange={onChange}
              error={Boolean(errors.name)}
            />
          )}
        />
        {errors.name && <FormHelperText sx={{ color: 'error.main' }}></FormHelperText>}
      </FormControl>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Button size='large' type='submit' variant='contained' sx={{ mr: 3 }} startIcon={<SaveIcon />}>
          Guardar
        </Button>
        <Button size='large' variant='outlined' color='secondary' onClick={handleClose} startIcon={<CancelIcon />}>
          Cancel
        </Button>
      </Box>
    </form>
  )
}
export default AddTarifas
