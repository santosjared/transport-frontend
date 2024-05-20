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
import React, { ChangeEvent, ReactNode, useState } from 'react'
import Icon from "src/@core/components/icon"
import ClearIcon from '@mui/icons-material/Clear';

interface Props {
  toggle: () => void
}
interface InputsTarifa {
  tipo: string
  tarifa: string
}
const defaultTarifa = [
  { tipo: 'Escolar', tarifa: 'Bs. 0.50' },
  { tipo: 'Universitario', tarifa: 'Bs. 1' },
  { tipo: 'Adulto', tarifa: 'Bs. 1.50' },
  { tipo: 'Tercera Edad', tarifa: 'Bs. 1' },
]
const AddTarifas = ({ toggle }: Props) => {

  const [addTarifa, setAddTarifa] = useState(defaultTarifa)
  const [name,setName] = useState('')
  const [description,setDescription] = useState('')

  const { Post } = useService()
  const queryClient = useQueryClient()
  const mutation = useMutation((Data: object) => Post('/tarifa', Data), {
    onSuccess: () => {
      queryClient.invalidateQueries('tarifa')
    }
  })

  const handleAddTarifa = () => {
    setAddTarifa([...addTarifa, { tipo: 'Nueva Tarifa', tarifa: 'Bs. 0.00' }])
  }
  const handleRemoveTarifa = (index: number) => {
    const newImputs = [...addTarifa]
    newImputs.splice(index, 1)
    setAddTarifa(newImputs)
  }
  const handleChangeTarifa = (value: string, index: number, key: keyof InputsTarifa) => {
    const newInputs = [...addTarifa]
    newInputs[index][key] = value
    setAddTarifa(newInputs)
  }

  const handleSaveOnclick =()=>{
    const data = {
      rates:addTarifa,
      name:name,
      description:description
    }
    mutation.mutate(data)
    handleReset()
  }
  const handleReset = () =>{
    setName('')
    setDescription('')
    setAddTarifa(defaultTarifa)
  }
  const handleClose = () => {
    toggle()
    handleReset()
  }
  return (
    <Box>
      <fieldset style={{ border: '1.5px solid #EEEDED', borderRadius: 10, paddingTop: 20 }}>
        <legend style={{ textAlign: 'center' }}>Agregar Tarifas</legend>

        {addTarifa.map((value, index) => (
          <Grid container spacing={2}>
            <Grid item xs={7}>
              <FormControl fullWidth sx={{ mb: 6 }}>
                <TextField label='Tipo Tarifa' value={value.tipo} variant='standard' 
                onChange={(e) => handleChangeTarifa(e.target.value, index, 'tipo')} fullWidth 
                autoComplete='off'/>
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <FormControl fullWidth sx={{ mb: 1 }}>
                <TextField label='Tarifa' value={value.tarifa} variant='standard' 
                onChange={(e) => handleChangeTarifa(e.target.value, index, 'tarifa')} fullWidth 
                autoComplete='off'/>
              </FormControl>
            </Grid>
            <Grid item xs={1}>
              <FormControl fullWidth sx={{ mb: 6 }}>
                <IconButton size='medium' sx={{ color: 'text.primary', top: 16 }} onClick={() => handleRemoveTarifa(index)}>
                  <ClearIcon />
                </IconButton>
              </FormControl>
            </Grid>
          </Grid>
        ))}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 6 }}>
          <IconButton size='small' sx={{ color: theme => theme.palette.primary.main }} onClick={handleAddTarifa}>
            <Icon icon='zondicons:add-outline' fontSize={25}></Icon>
          </IconButton>
        </Box>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <FormControl fullWidth sx={{ mb: 6 }}>
              <TextField
                label='Nomber de Tarifa'
                placeholder='tarifa 110'
                value={name}
                autoComplete='off'
                onChange={(e)=>setName(e.target.value)}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth sx={{ mb: 6 }}>
              <TextField
                label='Decripción'
                placeholder='opcional'
                autoComplete='off'
                onChange={(e)=>setDescription(e.target.value)}
              />
            </FormControl>
          </Grid>
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button size='large' variant='outlined' color='secondary' onClick={handleClose} startIcon={<CancelIcon />}>
            Cancel
          </Button>
          <Button size='large' type='submit' variant='contained' sx={{ mr: 3 }} onClick={handleSaveOnclick} startIcon={<SaveIcon />}>
            Guardar
          </Button>
        </Box>
      </fieldset>
    </Box>
  )
}
export default AddTarifas
