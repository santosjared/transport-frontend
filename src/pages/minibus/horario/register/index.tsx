import { Box, Button, Checkbox, FormControl, FormControlLabel, Grid, Tab, Tabs, TextField } from "@mui/material"
import { ChangeEvent, useRef, useState } from "react";
import React from 'react';
import TabPanel from "src/components/TabPanel";
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Cancel'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { styled } from '@mui/material/styles';
import { useMutation, useQueryClient } from "react-query";
import { useService } from "src/hooks/useService";

const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

interface Props {
    toggle: () => void
}

const StyledTextField = styled(TextField)({
    '& input': {
        textAlign: 'center',
    },
});
const RegisterHorario = ({ toggle }: Props) => {

    const [value, setValue] = useState(0);
    const [name, setName] = useState('')

    const [firstOutIda, setFirstOutIda] = useState('00:00');
    const [lastOutIda, setLastOutIda] = useState('00:00');
    const [DaysIda, setDaysIda] = useState<string[]>([]);
    const [placeIda, setPlaceIda] = useState('')
    const [descriptionIda, setDescriptionIda] = useState('')

    const [firstOutVuelta, setFirstOutVuelta] = useState('00:00');
    const [lastOutVuelta, setLastOutVuelta] = useState('00:00');
    const [DaysVuelta, setDaysVuelta] = useState<string[]>([]);
    const [placeVuelta, setPlaceVuelta] = useState('')
    const [descriptionVuelta, setDescriptionVuelta] = useState('')

    const { Post, Get } = useService()
    const queryClient = useQueryClient()
    const mutation = useMutation((Data: object) => Post('/horario', Data), {
        onSuccess: () => {
          queryClient.invalidateQueries('horario')
        }
      })
    

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value)
    }
    const handleClose = () => {
        toggle()
        handleReset()
    }
    const handleCheckboxIdaChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = event.target;
        if (checked) {
            setDaysIda([...DaysIda, value]);
        } else {
            setDaysIda(DaysIda.filter((day) => day !== value));
        }
    };
    const handleCheckboxVueltaChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = event.target;
        if (checked) {
            setDaysVuelta([...DaysVuelta, value]);
        } else {
            setDaysVuelta(DaysVuelta.filter((day) => day !== value));
        }
    };
    const handleSaveClick = () =>{
        console.log('dispara')
        const data = {
            name:name,
            horarioIda:{
                place:placeIda,
                firstOut:firstOutIda,
                lastOut:lastOutIda,
                days:DaysIda,
                description:descriptionIda
            },
            horarioVuelta:{
                place:placeVuelta,
                firstOut:firstOutVuelta,
                lastOut:lastOutVuelta,
                days:DaysVuelta,
                description:descriptionVuelta
            }
        }
        mutation.mutate(data)
        handleReset()
    }
    const handleReset = () =>{
        setFirstOutIda('00:00')
        setLastOutIda('00:00')
        setPlaceIda('')
        setDaysIda([])
        setFirstOutVuelta('00:00')
        setLastOutVuelta('00:00')
        setPlaceVuelta('')
        setDaysVuelta([])
    }
    return (
        <Box>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 6 }}>
                <Tabs value={value} onChange={handleChange} aria-label="horizontal tabs">
                    <Tab label="Horarios de Ida" />
                    <Tab label="Horarios de Vuelta" />
                    <Tab label="Nombre del Horario" />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
            <Box sx={{ border: '1px solid #EEEDED', borderTopLeftRadius: 10, borderTopRightRadius: 10, pl: 5 }}>
                <Grid container spacing={2}>
                    {days.map((day, index) => (
                        <Grid key={index} item xs={4}>
                            <FormControlLabel
                                control={<Checkbox checked={DaysIda.includes(day)} onChange={handleCheckboxIdaChange} value={day} />}
                                label={day}
                            />
                        </Grid>
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
                                label='Hora última Salida'
                                variant="outlined"
                                value={firstOutIda}
                                onChange={(e)=>setFirstOutIda(e.target.value)}
                                type='time'
                                autoComplete='off'
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
                                label='Hora última Salida'
                                variant="outlined"
                                autoComplete='off'
                                value={lastOutIda}
                                onChange={(e)=>setLastOutIda(e.target.value)}
                                type='time'
                                inputProps={{
                                    maxLength: 5,
                                    pattern: '^(2[0-3]|[01]?[0-9]):([0-5]?[0-9])$',
                                    placeholder: 'HH:mm',
                                }}
                            />
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                <FormControl fullWidth sx={{mb:6}}>
                            <TextField
                                label='Lugar de salida'
                                placeholder='Las Lecherias'
                                autoComplete='off'
                                value={placeIda}
                                onChange={(e)=>setPlaceIda(e.target.value)}
                            />
                        </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <FormControl fullWidth sx={{ mb: 6 }}>
                        <TextField
                            label='Descripción'
                            placeholder='opcional'
                            autoComplete='off'
                            value={descriptionIda}
                            onChange={(e)=>setDescriptionIda(e.target.value)}
                        />
                    </FormControl>
                </Grid>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    
                    <Button size='large' variant='outlined' color='secondary' onClick={handleClose} startIcon={<CancelIcon />}>
                        Cancel
                    </Button>
                    <Button size='large' type='submit' variant='contained' sx={{ mr: 3 }} 
                    onClick={()=>setValue(1)}
                    startIcon={<ArrowForwardIosIcon />}
                    >
                        Siguiente
                    </Button>
                </Box>
            </Box>
            </TabPanel>
            <TabPanel value={value} index={1}>
            <Box sx={{ border: '1px solid #EEEDED', borderTopLeftRadius: 10, borderTopRightRadius: 10, pl: 5 }}>
                <Grid container spacing={2}>
                    {days.map((day, index) => (
                        <Grid key={index} item xs={4}>
                            <FormControlLabel
                                control={<Checkbox checked={DaysVuelta.includes(day)} onChange={handleCheckboxVueltaChange} value={day} />}
                                label={day}
                            />
                        </Grid>
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
                                label='Hora última Salida'
                                variant="outlined"
                                autoComplete='off'
                                value={firstOutVuelta}
                                onChange={(e)=>setFirstOutVuelta(e.target.value)}
                                type='time'
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
                                label='Hora última Salida'
                                variant="outlined"
                                value={lastOutVuelta}
                                autoComplete='off'
                                onChange={(e)=>setLastOutVuelta(e.target.value)}
                                type='time'
                                inputProps={{
                                    maxLength: 5,
                                    pattern: '^(2[0-3]|[01]?[0-9]):([0-5]?[0-9])$',
                                    placeholder: 'HH:mm',
                                }}
                            />
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                <FormControl fullWidth sx={{mb:6}}>
                            <TextField
                                label='Lugar de salida'
                                placeholder='Las Lecherias'
                                value={placeVuelta}
                                autoComplete='off'
                                onChange={(e)=>setPlaceVuelta(e.target.value)}
                            />
                        </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <FormControl fullWidth sx={{ mb: 6 }}>
                        <TextField
                            label='Descripción'
                            placeholder='opcional'
                            value={descriptionVuelta}
                            autoComplete='off'
                            onChange={(e)=>setDescriptionVuelta(e.target.value)}
                        />
                    </FormControl>
                </Grid>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button size='large' variant='outlined' color='secondary' onClick={handleClose} startIcon={<CancelIcon />}>
                        Cancel
                    </Button>
                    <Button size='large' type='submit' variant='contained' sx={{ mr: 3 }} 
                    onClick={()=>setValue(2)}
                    startIcon={<ArrowForwardIosIcon />}>
                        Siguiente
                    </Button>
                </Box>
            </Box>
            </TabPanel>
            <TabPanel value={value} index={2}>
                <Box sx={{ border: '1px solid #EEEDED', borderRadius: 1, p: 5 }}>
                    <FormControl fullWidth sx={{ mb: 6 }}>
                        <TextField
                            label='Nombre de horario'
                            placeholder='horario 012'
                            autoComplete='off'
                            value={name}
                            onChange={handleNameChange}
                        />
                    </FormControl>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button size='large' variant='outlined' color='secondary' onClick={handleClose} startIcon={<CancelIcon />}>
                            Cancel
                        </Button>
                        <Button size='large' type='submit' variant='contained' sx={{ mr: 3 }} onClick={handleSaveClick}
                            startIcon={<SaveIcon />}>
                            Guardar
                        </Button>
                    </Box>
                </Box>
            </TabPanel>
        </Box >
    )
}
export default RegisterHorario