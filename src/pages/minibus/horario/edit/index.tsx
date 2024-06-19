import { Box, Button, Checkbox, FormControl, FormControlLabel, FormHelperText, Grid,TextField } from "@mui/material"
import { ChangeEvent, FormEvent, Fragment, useEffect, useState } from "react";
import React from 'react';
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Cancel'
import { styled } from '@mui/material/styles';
import { addHorario, updateHorario } from "src/store/apps/horario";
import { useDispatch } from "react-redux";
import { AppDispatch } from "src/store";
import Swal from "sweetalert2";

const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo', 'Feriados']

interface Props {
    toggle: () => void
    store:any
}
interface horarioDta {
    name:string
    place:string,
    firstOut:string
    lastOut:string
    days:string[],
    description:string
    otherDay:string
}
const defaultErrors = {
    name:'',
    place:'',
    firstOut:'',
    lastOut:'',
    days:'',
    description:''
}
const defaultData: horarioDta = {
    name: '',
    place: '',
    firstOut: '00:00',
    lastOut: '00:00',
    days: [],
    description: '',
    otherDay:''
};

const StyledTextField = styled(TextField)({
    '& input': {
        textAlign: 'center',
    },
});
const EditHorario = ({ toggle,store }: Props) => {

    const [horarioForms,setHorarioForms] = useState<horarioDta>(defaultData)
    const [formErrors,setFormErrors] = useState(defaultErrors)
    const dispatch = useDispatch<AppDispatch>()
    const [isLoading, setIsLoading] = useState(false)

    useEffect(()=>{
        if(store){
            setHorarioForms(store)
        }
    },[store])
    const handleClose = () => {
        toggle()
        handleReset()
    }
    const handleChangeFields = (e: ChangeEvent<HTMLInputElement>) => {
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
    const onSubmit = async (e: FormEvent) =>{  
        e.preventDefault()
        setIsLoading(true)
        try {
          const response = await dispatch(updateHorario({data:horarioForms,id:store.id}))
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
    const handleReset = () =>{
        setHorarioForms(defaultData);
        setFormErrors(defaultErrors);
        toggle();
    }
    return (
        <form onSubmit={onSubmit}>
            <Box sx={{ border: '1px solid #EEEDED', borderTopLeftRadius: 10, borderTopRightRadius: 10, pl: 5 }}>
                <Grid container spacing={2}>
                    {days.map((day, index) => (
                        <Fragment key={index}><Grid item xs={4}>
                            <FormControlLabel
                                control={<Checkbox checked={horarioForms.days.includes(day)} onChange={handleCheckboxIdaChange} value={day} />}
                                label={day}
                            />
                            {formErrors.days && <FormHelperText sx={{ color: 'error.main' }}>{formErrors.days}</FormHelperText>}
                        </Grid>
                          {index === days.length-1?
                          <Grid item xs={4}>
                            <FormControl fullWidth sx={{mb:3,pr:4}}>
                            <TextField 
                            label='Otro'
                            name="otherDay"
                            placeholder="Fin de semana"
                            value={horarioForms.otherDay}
                            error={Boolean(formErrors.days)}
                            helperText = {formErrors.days}
                            autoComplete='off'
                            onChange={handleChangeFields}
                            />
                          </FormControl>
                          </Grid>
                            :''
                            }
                    </Fragment>
                    ))}
                </Grid>
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
                                helperText = {formErrors.firstOut}
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
                                error = {Boolean(formErrors.lastOut)}
                                helperText = {formErrors.lastOut}
                                inputProps={{
                                    maxLength: 5,
                                    pattern: '^(2[0-3]|[01]?[0-9]):([0-5]?[0-9])$',
                                    placeholder: 'HH:mm',
                                }}
                            />
                        </FormControl>
                    </Grid>
                <Grid item xs={6}>
                <FormControl fullWidth sx={{mb:6}}>
                            <TextField
                                label='Lugar de salida'
                                name="place"
                                placeholder='Las Lecherias'
                                autoComplete='off'
                                value={horarioForms.place}
                                onChange={handleChangeFields}
                                error={Boolean(formErrors.place)}
                                helperText = {formErrors.place}
                            />
                        </FormControl>
                </Grid>
                <Grid item xs={6}>
                <FormControl fullWidth sx={{mb:6}}>
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
                    <Button size='large' variant='outlined' color='secondary' onClick={handleClose} startIcon={<CancelIcon />}>
                        Cancel
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