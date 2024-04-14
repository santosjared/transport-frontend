import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import Drawer from "@mui/material/Drawer"
import { styled } from '@mui/material/styles'
import { Controller, useForm } from "react-hook-form"
import Box, { BoxProps } from '@mui/material/Box'
import Typography from "@mui/material/Typography"
import IconButton from "@mui/material/IconButton"
import Icon from "src/@core/components/icon"
import FormControl from "@mui/material/FormControl"
import TextField from "@mui/material/TextField"
import FormHelperText from "@mui/material/FormHelperText"
import Button from "@mui/material/Button"
import { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/store';
import { addBus } from 'src/store/apps/bus';
import { Autocomplete, Card, CardMedia, Grid } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';
import { useService } from 'src/hooks/useService';
import { useMutation, useQuery } from 'react-query';

interface Props {
    toggle: () => void
}

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});
const RegisterBus = ({ toggle }: Props) => {
    const [errorMessage, setErrorMessage] = useState('')
    const [photo, setPhoto] = useState<string>('/images/default/licence.png')
    const [file, setFile] = useState<File | null>(null)
    const [onSelectGps, setOnselectGpas] = useState<any>(null)

    const { Get } = useService()
    const { data } = useQuery('divice', () => Get('/divice'))
    const dispatch = useDispatch<AppDispatch>()

    const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files?.[0] || null
            setFile(file)
            if (file?.type.startsWith('image/')) {
                const imgURL = URL.createObjectURL(file);
                setPhoto(imgURL);
                setErrorMessage('')
            } else {
                setErrorMessage('Por favor, selecciona un archivo de imagen válido.')
                setPhoto('/images/default/licence.png')
            }
        }
    }
    const handleClose = () => {
        setPhoto('/images/default/licence.png')
        toggle()
    }
    const handleImage = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file?.type.startsWith('image/')) {
            const imgURL = URL.createObjectURL(file);
            setPhoto(imgURL);
            setErrorMessage('')
        } else {
            setErrorMessage('Por favor, selecciona un archivo de imagen válido.')
            setPhoto('/images/default/licence.png')
        }
    }
    return (
        <Box sx={{ border: '1px solid #EEEDED', borderRadius: 1, p: 5 }}>
            <FormControl fullWidth sx={{ mb: 6 }}>
                <Card>
                    <CardMedia sx={{ height: 200 }} image={photo} />
                    <Button component="label" size='large' variant="contained"
                        sx={{ width: '100%', borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
                        startIcon={<CloudUploadIcon />}>
                        Seleccionar Foto de MicroBus
                        <VisuallyHiddenInput
                            type="file"
                            onChange={handleChangeImage}
                            accept='image/*' />
                    </Button>
                    {errorMessage && <Box style={{ color: 'red' }}>{errorMessage}</Box>}
                </Card>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 6 }}>
                <TextField
                    value={''}
                    label='Marca'
                    placeholder='Nissan'
                />
                {<FormHelperText sx={{ color: 'error.main' }}></FormHelperText>}
            </FormControl>
            <FormControl fullWidth sx={{ mb: 6 }}>
                <TextField
                    value={''}
                    label='Modelo'
                    placeholder='2006'
                />
                {<FormHelperText sx={{ color: 'error.main' }}></FormHelperText>}
            </FormControl>
            <FormControl fullWidth sx={{ mb: 6 }}>
                <TextField
                    value={''}
                    label='Tipo de Vehículo'
                    placeholder='Civilian'
                />
                {<FormHelperText sx={{ color: 'error.main' }}></FormHelperText>}
            </FormControl>
            <FormControl fullWidth sx={{ mb: 6 }}>
                <TextField
                    value={''}
                    label='Placa del Vehículo'
                    placeholder='XYZ 897'
                />
                {<FormHelperText sx={{ color: 'error.main' }}></FormHelperText>}
            </FormControl>
            <FormControl fullWidth sx={{ mb: 6 }}>
                <TextField
                    value={''}
                    type='number'
                    label='Cantidad de asientos'
                    placeholder='32'
                />
                {<FormHelperText sx={{ color: 'error.main' }}></FormHelperText>}
            </FormControl>
            <FormControl fullWidth sx={{ mb: 6 }}>
                <Autocomplete
                    options={data?.data as Array<{ name: string }>}
                    getOptionLabel={(option) => option.name}
                    onChange={(event, value) => setOnselectGpas(value)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label='Asignar GPS'
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
                    Guaradar
                </Button>
                <Button size='large' variant='outlined' color='secondary' onClick={handleClose} startIcon={<CancelIcon />}>
                    Cancel
                </Button>
            </Box>
        </Box>
    )
}
export default RegisterBus
