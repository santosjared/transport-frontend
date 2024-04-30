import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import FormControl from "@mui/material/FormControl"
import TextField from "@mui/material/TextField"
import FormHelperText from "@mui/material/FormHelperText"
import Button from "@mui/material/Button"
import { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/store';
import { Autocomplete, Card, CardMedia } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useService } from 'src/hooks/useService';
import { useMutation, useQuery, useQueryClient } from 'react-query';

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
    const [trademark, setTrademark] = useState<string | null>(null)
    const [model, setModel] = useState<string | null>(null)
    const [type, setType] = useState<string | null>(null)
    const [plaque, setPlaque] = useState<string | null>('')
    const [cantidad, setCantidad] = useState<string | null>(null)

    const { Post } = useService()

    const queryClient = useQueryClient()
    const mutation = useMutation((Data: object) => Post('/bus', Data), {
        onSuccess: () => {
            queryClient.invalidateQueries('bus')
        }
    })
    const handleSaveOnclick = () => {
        const data = {
            trademark: trademark,
            model: model,
            type: type,
            plaque: plaque,
            cantidad: cantidad,
            photo: file
        }
        mutation.mutate(data)
        handleReset();
        toggle();
    }
    const handleReset = () => {
        setTrademark(null)
        setModel(null)
        setType(null)
        setPlaque(null)
        setCantidad(null)
        setFile(null)
        setPhoto('/images/default/licence.png')
    }
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
        handleReset();
        toggle();
        
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
                        autoComplete='off'
                            type="file"
                            onChange={handleChangeImage}
                            accept='image/*' />
                    </Button>
                    {errorMessage && <FormHelperText sx={{ color: 'error.main' }}>{errorMessage}</FormHelperText>}
                </Card>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 6 }}>
                <TextField
                    value={trademark}
                    label='Marca'
                    placeholder='Nissan'
                    autoComplete='off'
                    onChange={(e) => setTrademark(e.target.value)}
                />
            </FormControl>
            <FormControl fullWidth sx={{ mb: 6 }}>
                <TextField
                    value={model}
                    label='Modelo'
                    placeholder='2006'
                    autoComplete='off'
                    onChange={(e) => setModel(e.target.value)}
                />
                {<FormHelperText sx={{ color: 'error.main' }}></FormHelperText>}
            </FormControl>
            <FormControl fullWidth sx={{ mb: 6 }}>
                <TextField
                    value={type}
                    label='Tipo de Vehículo'
                    placeholder='Civilian'
                    autoComplete='off'
                    onChange={(e) => setType(e.target.value)}
                />
                {<FormHelperText sx={{ color: 'error.main' }}></FormHelperText>}
            </FormControl>
            <FormControl fullWidth sx={{ mb: 6 }}>
                <TextField
                    value={plaque}
                    label='Placa del Vehículo'
                    placeholder='XYZ 897'
                    autoComplete='off'
                    onChange={(e) => setPlaque(e.target.value)}
                />
                {<FormHelperText sx={{ color: 'error.main' }}></FormHelperText>}
            </FormControl>
            <FormControl fullWidth sx={{ mb: 6 }}>
                <TextField
                    value={cantidad}
                    type='number'
                    label='Cantidad de asientos'
                    placeholder='32'
                    autoComplete='off'
                    onChange={(e) => setCantidad(e.target.value)}
                />
                {<FormHelperText sx={{ color: 'error.main' }}></FormHelperText>}
            </FormControl>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button size='large' variant='outlined' color='secondary' onClick={handleClose} startIcon={<CancelIcon />}>
                    Cancel
                </Button>
                <Button size='large' type='submit' variant='contained' sx={{ mr: 3 }} onClick={handleSaveOnclick} startIcon={<SaveIcon />}>
                    Guaradar
                </Button>
            </Box>
        </Box>
    )
}
export default RegisterBus
