import { Box, Button, Checkbox, FormControl, FormControlLabel, FormHelperText, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material"
import { ChangeEvent, FormEvent, Fragment, useEffect, useState } from "react";
import React from 'react';
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Cancel'
import { styled } from '@mui/material/styles';
import { addHorario, updateHorario } from "src/store/apps/horario";
import { useDispatch } from "react-redux";
import { AppDispatch } from "src/store";
import Swal from "sweetalert2";
import { apiService } from "src/store/services/apiService";

const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo', 'Feriados']

interface Props {
  toggle: () => void
  store: any
  page:number
  pageSize:number
}
interface horarioDta {
  name: string
  place: string,
  arrive: string;
  firstOut: string
  lastOut: string
  frequency: number | string
  time: string
  days: string[],
  otherDay: string
  description: string
}
const defaultErrors = {
  name: '',
  place: '',
  arrive: '',
  firstOut: '',
  frequency: '',
  time: '',
  lastOut: '',
  days: '',
  description: ''
}
const defaultData: horarioDta = {
  name: '',
  place: '',
  arrive: '',
  firstOut: '00:00',
  lastOut: '00:00',
  frequency: 0,
  time: 'min',
  days: [],
  otherDay: '',
  description: '',
};

const StyledTextField = styled(TextField)({
  '& input': {
    textAlign: 'center',
  },
});
const EditHorario = ({ toggle, store, page,pageSize }: Props) => {

  const [horarioForms, setHorarioForms] = useState<horarioDta>(defaultData)
  const [formErrors, setFormErrors] = useState(defaultErrors)
  const dispatch = useDispatch<AppDispatch>()
  const [isLoading, setIsLoading] = useState(false)
  const [otherDay, setOtherDay] = useState('')
  const [day, setDay] = useState<any[]>([])

  useEffect(() => {
    const fetch = async () => {
      const response = await apiService.Get('/days')
      setDay(response.data)
    }
    fetch()
  }, [toggle])

  useEffect(()=>{
    if(store){
      const dy = store.days?.map((day:any)=>{
        return day?._id
      })
      const data: horarioDta ={
        name:store.name,
        place:store.place,
        arrive:store?.arrive,
        firstOut: store.firstOut,
        lastOut: store.lastOut,
        frequency: store.frequency,
        time: store.time,
        days: dy,
        otherDay: '',
        description: store?.description,
      }
      setHorarioForms(data)
    }
  },[store])
  const handleChangeFields = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if(name === 'frequency'){
      setHorarioForms({
        ...horarioForms,
        [name]: parseInt(value)?parseInt(value):value
      })
    }else{
      setHorarioForms({
        ...horarioForms,
        [name]: value
      })
    }

    setFormErrors({
      ...formErrors,
      [name]: ''
    })
  }
  const handleChangeSelect = (e: SelectChangeEvent) => {
    const { name, value } = e.target
    setHorarioForms({
      ...horarioForms,
      [name]: value
    })

    setFormErrors({
      ...formErrors,
      [name]: ''
    })
  }
  const handleCheckboxIdaChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    if (checked) {
      setHorarioForms(prevHorarioForms => ({
        ...prevHorarioForms,
        days: [...horarioForms.days, value]
      }));
    } else {
      setHorarioForms(prevHorarioForms => ({
        ...prevHorarioForms,
        days: horarioForms.days.filter((day) => day !== value)
      }));
    }
  };
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await dispatch(updateHorario({ data: horarioForms, id: store.id, filtrs:{skip: page * pageSize, limit: pageSize} }))
      if (response.payload.success) {
        Swal.fire({ title: '¡Éxito!', text: 'Datos actualizados exitosamente', icon: "success" });
        handleReset()
      } else {
        if (response.payload.data) {
          const { data } = response.payload
          formErrors.name = data.name
          formErrors.place = data.place
          formErrors.firstOut = data.firstOut
          formErrors.lastOut = data.lastOut
          formErrors.days = data.days
          formErrors.frequency = data.frequency
          formErrors.time = data.time
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
  const handleReset = () => {
    setHorarioForms(defaultData);
    formErrors.days=''
    formErrors.description=''
    formErrors.firstOut=''
    formErrors.frequency=''
    formErrors.lastOut = ''
    formErrors.name = ''
    formErrors.place =''
    formErrors.time = ''
    setFormErrors(formErrors);
    setOtherDay('')
    toggle();
  }
  return (
    <form onSubmit={onSubmit}>
      <Box sx={{ border: '1px solid #EEEDED', borderTopLeftRadius: 10, borderTopRightRadius: 10, pl: 5 }}>
        <Grid container spacing={2}>
          {day.map((day, index) => (
            <Fragment key={day.id}><Grid item xs={4}>
              <FormControlLabel
                control={<Checkbox checked={horarioForms.days.includes(day._id)} onChange={handleCheckboxIdaChange} value={day._id} />}
                label={day.name}
              />
            </Grid>

            </Fragment>
          ))}
          <Grid item xs={4}>
            <FormControl fullWidth sx={{ mb: 3, pr: 4 }}>
              <TextField
                label='Otro'
                name="otherDay"
                placeholder="Día de maestro"
                value={otherDay}
                autoComplete='off'
                onChange={e => setOtherDay(e.target.value)}
              />
            </FormControl>
          </Grid>
        </Grid>
        <Box sx={{ mb: 3 }}>{formErrors.days && <FormHelperText sx={{ color: 'error.main' }}>{formErrors.days}</FormHelperText>}</Box>
      </Box>
      <Box sx={{
        borderTop: 0, borderBottom: '1px solid #EEEDED', borderLeft: '1px solid #EEEDED', borderRight: '1px solid #EEEDED',
        borderBottomLeftRadius: 10, borderBottomRightRadius: 10, p: 5
      }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <StyledTextField
                fullWidth
                label='Hora primera Salida'
                variant="outlined"
                name="firstOut"
                value={horarioForms.firstOut}
                onChange={handleChangeFields}
                type='time'
                autoComplete='off'
                error={Boolean(formErrors.firstOut)}
                helperText={formErrors.firstOut}
                inputProps={{
                  maxLength: 5,
                  pattern: '^(2[0-3]|[01]?[0-9]):([0-5]?[0-9])$',
                  placeholder: 'HH:mm',
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth sx={{ mb: 6 }}>
              <StyledTextField
                fullWidth
                name="lastOut"
                label='Hora última Salida'
                variant="outlined"
                autoComplete='off'
                value={horarioForms.lastOut}
                onChange={handleChangeFields}
                type='time'
                error={Boolean(formErrors.lastOut)}
                helperText={formErrors.lastOut}
                inputProps={{
                  maxLength: 5,
                  pattern: '^(2[0-3]|[01]?[0-9]):([0-5]?[0-9])$',
                  placeholder: 'HH:mm',
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth sx={{ mb: 6 }}>
              <TextField
                label='Lugar de partida'
                name="place"
                placeholder='Ciudadela'
                autoComplete='off'
                value={horarioForms.place}
                onChange={handleChangeFields}
                error={Boolean(formErrors.place)}
                helperText={formErrors.place}
              />
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth sx={{ mb: 6 }}>
              <TextField
                label='Lugar de llegada'
                name="arrive"
                placeholder='Plaza San Bernardo'
                autoComplete='off'
                value={horarioForms.arrive}
                onChange={handleChangeFields}
                error={Boolean(formErrors.arrive)}
                helperText={formErrors.arrive}
              />
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth sx={{ mb: 6 }}>
              <TextField
                label='Frecuncia de salidad'
                name="frequency"
                type="number"
                placeholder='15'
                autoComplete='off'
                value={horarioForms.frequency}
                onChange={handleChangeFields}
                error={Boolean(formErrors.frequency)}
                helperText={formErrors.frequency}
              />
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth sx={{ mb: 6 }}>
              <InputLabel id="demo-simple-select-label">Unidad de tiempo</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                name="time"
                id="demo-simple-select"
                value={horarioForms.time}
                label="Unidad de tiempo"
                onChange={handleChangeSelect}
              >
                <MenuItem value={'min'}>min</MenuItem>
                <MenuItem value={'hrs'}>hrs</MenuItem>
              </Select>
              {formErrors.time && <FormHelperText sx={{ color: 'error.main' }}>{formErrors.time}</FormHelperText>}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth sx={{ mb: 6 }}>
              <TextField
                label='Nombre de horario'
                name="name"
                placeholder='Horario Ida'
                autoComplete='off'
                value={horarioForms.name}
                onChange={handleChangeFields}
                error={Boolean(formErrors.name)}
                helperText={formErrors.name}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth sx={{ mb: 6 }}>
              <TextField
                label='Descripción'
                name="description"
                placeholder='opcional'
                autoComplete='off'
                value={horarioForms.description}
                onChange={handleChangeFields}
              />
            </FormControl>
          </Grid>
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button size='large' variant='outlined' color='secondary' onClick={handleReset} startIcon={<CancelIcon />}>
            Cancelar
          </Button>
          <Button size='large' type='submit' variant='contained' sx={{ mr: 3 }}
            startIcon={<SaveIcon />}
          >
            guardar
          </Button>
        </Box>
      </Box>
    </form>
  )
}
export default EditHorario
