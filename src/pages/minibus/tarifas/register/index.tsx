import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Cancel'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { Grid,IconButton } from '@mui/material'
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import Icon from "src/@core/components/icon"
import ClearIcon from '@mui/icons-material/Clear';
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import { addTarifa } from 'src/store/apps/tarifa'
import Swal from 'sweetalert2'
import { apiService } from 'src/store/services/apiService'

interface Props {
  toggle: () => void
  page:number
  pageSize:number
}
interface InputsTarifa {
  tipo: string
  tarifa: string
}
interface tarifaData {
  rates: any[]
  name: string
  description: string
}

const defaultDta: tarifaData = {
  rates: [],
  name: '',
  description: ''
}
const defaultErrors = {
  name: '',
  tipo: '',
  tarifa: ''
}
const AddTarifas = ({ toggle, page, pageSize }: Props) => {

  const [formErrors, setFormErrors] = useState(defaultErrors)
  const [tarifaForms, setTarifaForms] = useState<tarifaData>(defaultDta)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      const response = await apiService.Get('/tarifas')
      setTarifaForms(preview => ({
        ...preview, rates:response.data}))
    }
    fetch()
  }, [toggle])

  const dispatch = useDispatch<AppDispatch>()
  const handleAddTarifa = () => {
    setTarifaForms(prevTarifaForms => ({
      ...prevTarifaForms,
      rates: [...prevTarifaForms.rates, { tipo: 'Nueva Tarifa', tarifa: 'Bs. 0.00' }]
    }));
  }
  const handleRemoveTarifa = (index: number) => {
    const newRates = [...tarifaForms.rates];
    newRates.splice(index, 1);
    setTarifaForms(prevTarifaForms => ({
      ...prevTarifaForms,
      rates: newRates
    }));
  }
  const handleChangeTarifa = (value: string, index: number, key: keyof InputsTarifa) => {
    setTarifaForms(prevTarifaForms => ({
      ...prevTarifaForms,
      rates: prevTarifaForms.rates.map((rate, i) => i === index ? { ...rate, [key]: value } : rate)
    }));
  }
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await dispatch(addTarifa({data:tarifaForms, filtrs:{skip: page * pageSize, limit: pageSize}}))
      if (response.payload.success) {
        Swal.fire({ title: '¡Éxito!', text: 'Datos guardados exitosamente', icon: "success" });
        handleReset()
      } else {
        if (response.payload.data) {
          const { data } = response.payload
          formErrors.name = data.name
          formErrors.tipo = data.tipo
          formErrors.tarifa = data.tarifa
        } else { Swal.fire({ title: '¡Error!', text: 'ocurio un error al guardar los datos', icon: "error" }); handleReset() }
      }
    } catch (error) {
      Swal.fire({ title: '¡Error!', text: 'ocurio un error al guardar los datos', icon: "error" });
      handleReset()
    } finally {
      setIsLoading(false)
      setFormErrors(formErrors)
    }
  }
  const handleChangeFields = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setTarifaForms({
      ...tarifaForms,
      [name]: value
    })
    setFormErrors({
      ...formErrors,
      [name]: ''
    })
  }
  const handleReset = () => {
    setTarifaForms(defaultDta)
    setFormErrors(defaultErrors)
    toggle()
  }
  return (
    <Box>
      <fieldset style={{ border: '1.5px solid #EEEDED', borderRadius: 10, paddingTop: 20 }}>
        <legend style={{ textAlign: 'center' }}>Agregar Tarifas</legend>
        <form onSubmit={onSubmit}>
          {tarifaForms.rates.map((value, index) => (
            <Grid key={index} container spacing={2}>
              <Grid item xs={7}>
                <FormControl fullWidth sx={{ mb: 6 }}>
                  <TextField label='Tipo Tarifa' value={value.tipo} variant='standard'
                    onChange={(e) => handleChangeTarifa(e.target.value, index, 'tipo')}
                    fullWidth
                    error={Boolean(formErrors.tipo)}
                    helperText={formErrors.tipo}
                    autoComplete='off' />
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <FormControl fullWidth sx={{ mb: 1 }}>
                  <TextField label='Tarifa' value={value.tarifa} variant='standard'
                    onChange={(e) => handleChangeTarifa(e.target.value, index, 'tarifa')}
                    fullWidth
                    error={Boolean(formErrors.tarifa)}
                    helperText={formErrors.tarifa}
                    autoComplete='off' />
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
                  name='name'
                  label='Nomber de Tarifa'
                  placeholder='tarifa 110'
                  value={tarifaForms.name}
                  error={Boolean(formErrors.name)}
                  helperText={formErrors.name}
                  autoComplete='off'
                  onChange={handleChangeFields}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth sx={{ mb: 6 }}>
                <TextField
                  name='description'
                  label='Decripción'
                  placeholder='opcional'
                  autoComplete='off'
                  value={tarifaForms.description}
                  onChange={handleChangeFields}
                />
              </FormControl>
            </Grid>
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button size='large' variant='outlined' color='secondary' onClick={handleReset} startIcon={<CancelIcon />}>
              Cancelar
            </Button>
            <Button size='large' type='submit' variant='contained' sx={{ mr: 3 }} startIcon={<SaveIcon />}>
              Guardar
            </Button>
          </Box>
        </form>
      </fieldset>
    </Box>
  )
}
export default AddTarifas
