import { Box, Button, Checkbox, FormControl, FormControlLabel, Grid, Tab, Tabs, TextField } from "@mui/material"
import { ChangeEvent, useRef, useState } from "react";
import React from 'react';
import TabPanel from "src/components/TabPanel";
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Cancel'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { styled } from '@mui/material/styles';

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

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value)
    }
    const handleClose = () => {
        toggle()
    }
    const handleCheckboxIdaChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = event.target;
        if (checked) {
            setDaysIda([...DaysIda, value]);
        } else {
            setDaysIda(DaysIda.filter((day) => day !== value));
        }
    };
    const handleFirstIdaChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFirstOutIda(e.target.value);
    };
    const handleLastIdaChange = (e: ChangeEvent<HTMLInputElement>) => {
        setLastOutIda(e.target.value);
    };
    const handlePlaceIdaChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPlaceIda(e.target.value)
    }
    const handleDescriptionIdaChange = (e: ChangeEvent<HTMLInputElement>) => {
        setDescriptionIda(e.target.value)
    }
    
    const handleCheckboxVueltaChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = event.target;
        if (checked) {
            setDaysVuelta([...DaysVuelta, value]);
        } else {
            setDaysVuelta(DaysVuelta.filter((day) => day !== value));
        }
    };
    const handleFirstVueltaChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFirstOutVuelta(e.target.value);
    };
    const handleLastVueltaChange = (e: ChangeEvent<HTMLInputElement>) => {
        setLastOutVuelta(e.target.value);
    };
    const handlePlaceVueltaChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPlaceVuelta(e.target.value)
    }
    const handleDescriptionVueltaChange = (e: ChangeEvent<HTMLInputElement>) => {
        setDescriptionVuelta(e.target.value)
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
                                onChange={handleFirstIdaChange}
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
                                value={lastOutIda}
                                onChange={handleLastIdaChange}
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
                                value={placeIda}
                                onChange={handlePlaceIdaChange}
                            />
                        </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <FormControl fullWidth sx={{ mb: 6 }}>
                        <TextField
                            label='Descripción'
                            placeholder='opcional'
                            value={descriptionIda}
                            onChange={handleDescriptionIdaChange}
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
                                value={firstOutVuelta}
                                onChange={handleFirstVueltaChange}
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
                                onChange={handleLastVueltaChange}
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
                                onChange={handlePlaceVueltaChange}
                            />
                        </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <FormControl fullWidth sx={{ mb: 6 }}>
                        <TextField
                            label='Descripción'
                            placeholder='opcional'
                            value={descriptionVuelta}
                            onChange={handleDescriptionVueltaChange}
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
                            value={name}
                            onChange={handleNameChange}
                        />
                    </FormControl>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button size='large' variant='outlined' color='secondary' onClick={handleClose} startIcon={<CancelIcon />}>
                            Cancel
                        </Button>
                        <Button size='large' type='submit' variant='contained' sx={{ mr: 3 }}
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